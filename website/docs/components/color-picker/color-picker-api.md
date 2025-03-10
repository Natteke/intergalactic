---
title: API
fileSource: color-picker
---

@## ColorPicker

Widget for selecting the color.

```jsx
import ColorPicker from '@semcore/ui/color-picker';
<ColorPicker />;
```

@typescript ColorPickerProps

@## ColorPicker.Trigger

The wrap over the `<Dropdown.Trigger/>` component.

```jsx
import ColorPicker from '@semcore/ui/color-picker';
<ColorPicker.Trigger />;
```

@## ColorPicker.Popper

The wrap over the `<Dropdown.Popper/>` component.

```jsx
import ColorPicker from '@semcore/ui/color-picker';
<ColorPicker.Popper />;
```

@## ColorPicker.Colors

Group of ColorPicker.Items.

```jsx
import ColorPicker from '@semcore/ui/color-picker';
<ColorPicker.Colors />;
```

@typescript ColorsProps

@## ColorPicker.Item

One unit of `<ColorPicker.Colors />`. ColorPicker.Item is a swatch preview that allows a user to see what color is currently selected.

```jsx
import ColorPicker from '@semcore/ui/color-picker';
<ColorPicker.Item />;
```

@typescript ItemProps

@## PaletteManager

Part of ColorPicker that provides the ability to add and remove custom colors to the palette.

```jsx
import { PaletteManager } from '@semcore/ui/color-picker';
<PaletteManager />;
```

@typescript PaletteManagerProps

@## PaletteManager.Colors

Group of PaletteManager.Items.

```jsx
import { PaletteManager } from '@semcore/ui/color-picker';
<PaletteManager.Colors />;
```

@typescript ColorsCustomProps

@## PaletteManager.Item

One unit of `<PaletteManager.Colors />`. PaletteManager.Item is a swatch preview that allows a user to see what color is currently selected.

```jsx
import { PaletteManager } from '@semcore/ui/color-picker';
<PaletteManager.Item />;
```

@typescript ItemProps

@## ColorPicker.InputColor

Input for adding colors in hexadecimal format.

```jsx
import { PaletteManager } from '@semcore/ui/color-picker';
<PaletteManager.InputColor />;
```

@typescript InputColorProps
