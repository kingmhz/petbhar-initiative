export function SectionHeading({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const renderContent = () => {
    if (typeof children === 'string') {
      return children.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ));
    }
    return children;
  };

  return (
    <h2 className={`font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight ${className}`}>
      {renderContent()}
    </h2>
  );
}

export default SectionHeading;
