const parseDateRange = (query = {}) => {
  const { range = '30d', from, to } = query;
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  let start = new Date();

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case '7d':
      start = new Date(end.getTime() - 7 * 86400000);
      start.setHours(0, 0, 0, 0);
      break;
    case '30d':
      start = new Date(end.getTime() - 30 * 86400000);
      start.setHours(0, 0, 0, 0);
      break;
    case '90d':
      start = new Date(end.getTime() - 90 * 86400000);
      start.setHours(0, 0, 0, 0);
      break;
    case 'year':
      start = new Date(end.getFullYear(), 0, 1);
      break;
    case 'custom':
      start = from ? new Date(from) : new Date(end.getTime() - 30 * 86400000);
      if (to) end.setTime(new Date(to).getTime());
      end.setHours(23, 59, 59, 999);
      break;
    default:
      start = new Date(end.getTime() - 30 * 86400000);
      start.setHours(0, 0, 0, 0);
  }

  return { start, end, range };
};

const buildDayBuckets = (start, end) => {
  const buckets = [];
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);

  while (cursor <= endDay) {
    buckets.push({
      date: cursor.toISOString().slice(0, 10),
      label: cursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  if (buckets.length > 90) {
    const weekly = [];
    let i = 0;
    while (i < buckets.length) {
      weekly.push({
        date: buckets[i].date,
        label: buckets[i].label,
        endIndex: Math.min(i + 6, buckets.length - 1),
      });
      i += 7;
    }
    return { mode: 'week', buckets: weekly, allDays: buckets };
  }

  return { mode: 'day', buckets, allDays: buckets };
};

const aggregateByDay = (items, dateField, valueFn, buckets) => {
  const map = {};
  buckets.forEach((b) => {
    map[b.date] = { date: b.date, label: b.label, value: 0, count: 0 };
  });

  items.forEach((item) => {
    const d = new Date(item[dateField] || item.createdAt);
    if (Number.isNaN(d.getTime())) return;
    const key = d.toISOString().slice(0, 10);
    if (!map[key]) return;
    const val = valueFn(item);
    map[key].value += val.value || 0;
    map[key].count += val.count || 0;
  });

  return buckets.map((b) => map[b.date]);
};

module.exports = { parseDateRange, buildDayBuckets, aggregateByDay };
