# Responsive Design Quick Reference

## Screen Size Breakpoints

| Device Type | Width Range | Use Case |
|-------------|------------|----------|
| Mobile Phone | 320px - 479px | Small phones, single column |
| Small Tablet | 480px - 639px | Larger phones |
| Tablet | 640px - 768px | Standard tablets |
| Large Tablet | 769px - 1023px | iPad Pro, stacked layout |
| Medium Desktop | 1024px - 1365px | Laptops, 2-column layout |
| Large Desktop | 1366px - 1919px | Desktop monitors, 3-column |
| XL Desktop | 1920px+ | Wide monitors, 4-column |

## Responsive Utilities

### Using clamp() for Fluid Sizing
```javascript
// Font size scales between 12px and 16px depending on viewport
fontSize: "clamp(12px, 2vw, 16px)"

// Padding scales from 1rem at min viewport to 2rem at max
padding: "clamp(1rem, 5vw, 2rem)"
```

### Conditional Styling Based on screenSize
```javascript
// Smaller screens get one column, larger get two
gridTemplateColumns: screenSize < 1024 ? "1fr" : "1fr 1fr"

// Font size adapts to screen width
fontSize: screenSize >= 1920 ? 20 : screenSize >= 1366 ? 18 : 16
```

### Touch Device Detection
```javascript
// Only apply hover effects on non-touch devices
if (!('ontouchstart' in window)) {
  e.target.style.background = BLUE_DARK;
}
```

## Min-Height Standards

- Mobile phones: 40px buttons
- Tablets: 42-44px buttons  
- Desktop: 44-48px buttons
- Touch devices: Always 48px minimum

## Media Query Template

```css
/* Mobile First */
.element {
  /* Base mobile styles */
}

/* Tablets */
@media (min-width: 640px) {
  .element {
    /* Tablet adjustments */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .element {
    /* Desktop adjustments */
  }
}
```

## Common Responsive Patterns

### Flexible Container
```javascript
width: shouldStackVertically ? "100%" : sidebarWidth
```

### Fluid Typography
```javascript
fontSize: screenSize >= 1920 ? 36 : screenSize >= 1366 ? 32 : 28
```

### Responsive Gap/Spacing
```javascript
gap: screenSize >= 1920 ? "2rem" : screenSize >= 1366 ? "1.75rem" : "1rem"
```

### Grid Columns
```javascript
gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`
// Automatically adjusts number of columns based on screen width
```

## Testing the Responsive Design

### Browser DevTools
1. Open Developer Tools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select different devices from dropdown
4. Test in landscape and portrait modes

### Real Devices
- Test on actual phones, tablets, and desktop monitors
- Use Chrome Remote Debugging for mobile testing
- Check performance on older devices

### Key Things to Check
- ✓ Layout doesn't break at any screen size
- ✓ Text is readable without zooming
- ✓ Buttons and links are easy to tap
- ✓ Forms are usable on mobile
- ✓ Images don't overflow
- ✓ Navigation is accessible
- ✓ No horizontal scrolling needed

## Performance Tips

1. **Minimize Reflows** - Use CSS media queries instead of JavaScript when possible
2. **Image Optimization** - Use SVG for icons (scales perfectly)
3. **CSS Best Practices** - Avoid nested media queries
4. **JavaScript Detection** - Cache window width to avoid repeated calculations
5. **Touch Optimization** - Add `touch-action: manipulation` to interactive elements

## Common Pitfalls to Avoid

❌ Using fixed widths (use percentages or clamp)  
❌ Ignoring touch devices (always test on mobile)  
❌ Hover effects on touch (causes sluggish feel)  
❌ Small touch targets (minimum 44-48px)  
❌ Horizontal scrolling on mobile  
❌ Unoptimized images (use SVG or responsive images)  
❌ Forgetting viewport meta tag  

## Layout Decision Tree

```
Is screen < 1024px wide?
├─ YES: Stack form and contacts vertically
│   └─ Show contacts in single column grid
└─ NO: Show form sidebar on left
    ├─ Screen < 1366px?
    │   └─ Show 2-column contact grid
    ├─ Screen < 1920px?
    │   └─ Show 3-column contact grid
    └─ Screen >= 1920px?
        └─ Show 4-column contact grid
```

## Debugging Responsive Issues

1. **Check viewport meta tag** - Must be present in HTML
2. **Verify media queries** - Check DevTools breakpoints
3. **Test on real devices** - Emulation isn't always accurate
4. **Clear browser cache** - Old styles might be cached
5. **Check for fixed widths** - Use percentages or clamp()
6. **Inspect element styles** - Use DevTools to see applied styles
7. **Check z-index conflicts** - Especially with overlays/modals

## Code Examples

### Responsive Button Group
```javascript
<div style={{ 
  display: "flex", 
  gap: screenSize >= 1024 ? "1rem" : "0.5rem",
  flexWrap: screenSize >= 768 ? "nowrap" : "wrap"
}}>
  <button>Button 1</button>
  <button>Button 2</button>
</div>
```

### Responsive Form Section
```javascript
<div style={{
  width: shouldStackVertically ? "100%" : 300,
  borderRight: shouldStackVertically ? "none" : "1px solid #e5e7eb",
  borderBottom: shouldStackVertically ? "1px solid #e5e7eb" : "none"
}}>
  {/* Form content */}
</div>
```

### Responsive Typography
```javascript
<h2 style={{
  fontSize: screenSize >= 1920 ? 36 : 
            screenSize >= 1366 ? 32 : 
            screenSize >= 1024 ? 24 : 22
}}>
  Title
</h2>
```

---

**Remember**: Test frequently on real devices during development!
