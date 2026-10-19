import re

# Update Card.tsx
card_path = r'c:\Users\e.lukyanova\projects\gallery\src\entities\Card\ui\Card.tsx'
with open(card_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
old_import = "import { mediaBreakpointDown } from '../../../shared/styles/mixins';"
new_import = old_import + "\nimport { getResponsiveImageSources } from '../../../shared/lib/images';"
content = content.replace(old_import, new_import)

# Replace img with picture
old_img = "        <img src={card.image} alt={card.title} draggable={false} />"
new_img = "        <CardImage image={card.image} alt={card.title} />"
content = content.replace(old_img, new_img)

# Add CardImage component before export function Card
component = """const CardImage = ({ image, alt }: { image: string; alt: string }) => {
  const { mobile, desktop, fallback } = getResponsiveImageSources(image);
  return (
    <picture>
      <source media="(max-width: 768px)" srcSet={mobile} type="image/webp" />
      <source srcSet={desktop} type="image/webp" />
      <img src={fallback} alt={alt} loading="lazy" decoding="async" draggable={false} />
    </picture>
  );
};

"""
old_export = "export function Card({ card, onSelect, revealDelay, onRevealComplete }: CardProps) {"
content = content.replace(old_export, component + old_export)

with open(card_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Card.tsx updated')

# Update CardModal.tsx
modal_path = r'c:\Users\e.lukyanova\projects\gallery\src\features\CardModal\ui\CardModal.tsx'
with open(modal_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import - find the last import line and add after it
import_lines = []
for line in content.split('\n'):
    if line.startswith('import '):
        import_lines.append(line)
last_import = import_lines[-1]
new_import_line = last_import + "\nimport { getResponsiveImageSources } from '../../../shared/lib/images';"
content = content.replace(last_import, new_import_line)

# Replace img with picture in ImageContent
old_img = "        <img src={image} alt={imageAlt ?? ''} draggable={false} />"
new_img = """        <picture>
          <source media="(max-width: 768px)" srcSet={getResponsiveImageSources(image).mobile} type="image/webp" />
          <source srcSet={getResponsiveImageSources(image).desktop} type="image/webp" />
          <img src={getResponsiveImageSources(image).fallback} alt={imageAlt ?? ''} loading="lazy" decoding="async" draggable={false} />
        </picture>"""
content = content.replace(old_img, new_img)

with open(modal_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('CardModal.tsx updated')
