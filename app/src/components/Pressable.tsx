import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

interface PressableProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  style?: CSSProperties;
  /** `subtle` uses a smaller scale — for large cards rather than buttons. */
  press?: 'default' | 'subtle';
}

/**
 * A real <button> with the chrome stripped and the press-scale applied.
 * Everything tappable in the app goes through here so touch targets,
 * focus rings and keyboard activation stay consistent.
 */
export function Pressable({
  children,
  style,
  press = 'default',
  className,
  type = 'button',
  ...rest
}: PressableProps) {
  const cls = ['pc-reset', press === 'subtle' ? 'pc-press-subtle' : 'pc-press', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={cls} style={style} {...rest}>
      {children}
    </button>
  );
}
