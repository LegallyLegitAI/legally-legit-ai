interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent'
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent'
  }
  
  return (
    <button className={`${variants[variant]} ${className}`} {...props} />
  )
}