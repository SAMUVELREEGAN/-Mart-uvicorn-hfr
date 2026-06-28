import * as Fa from 'react-icons/fa';
import * as Fa6 from 'react-icons/fa6';
import * as Md from 'react-icons/md';
import * as Hi from 'react-icons/hi';
import * as Bi from 'react-icons/bi';
import * as Io from 'react-icons/io5';
import * as Ai from 'react-icons/ai';

const libraries = [Fa6, Fa, Md, Hi, Bi, Io, Ai];

export function getIcon(name) {
  if (!name) return null;
  for (const lib of libraries) {
    if (lib[name]) return lib[name];
  }
  return Fa.FaQuestion;
}

export function Icon({ name, className, size }) {
  const IconComponent = getIcon(name);
  if (!IconComponent) return null;
  return <IconComponent className={className} size={size} />;
}
