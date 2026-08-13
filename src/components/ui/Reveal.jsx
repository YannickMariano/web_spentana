import { useInView } from '../../hooks/useInView';

// Enveloppe générique pour l'apparition au scroll (fondu + léger déplacement
// vers le haut), équivalent du `data-reveal` du prototype de design.
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, inView] = useInView();
  const classes = [inView ? 'in-view' : '', className].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} data-reveal="" className={classes} {...rest}>
      {children}
    </Tag>
  );
}
