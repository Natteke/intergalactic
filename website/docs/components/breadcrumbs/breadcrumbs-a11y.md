---
title: A11y
a11y: AA
---

@## What component has

### Keyboard support

| Key              | Function                                         |
| ---------------- | ------------------------------------------------ |
| `Tab`            | Moves focus to the next focusable element.       |
| `Shift + Tab`    | Moves focus to the previous focusable element.   |
| `Space`, `Enter` | When focus is on the breadcrumb, opens the link. |

### Roles & attributes

The list below describes roles and attributes that component already has.

| Role    | Attribute                 | Element | Usage                                                                                                                                                             |
| ------- | ------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `group` |                           |         | The `group` role identifies a set of user interface objects that isn’t intended to be included in a page summary or table of contents by assistive technologies. |
|         | `aria-label="Breadcrumbs"` | `div`   | Provides a label for the group of links that describes the type of navigation provided.                                                                             |
|         | `aria-current="page"`     | `a`     | Applied to the last link in the set to indicate that it represents the current page.                                                                              |

@## Resources

- [W3 breadcrumbs example](https://www.w3.org/TR/wai-aria-practices-1.1/examples/breadcrumb/index.html) has detailed information about the accordion accessible behavior.
- [A11y style guide](https://a11y-style-guide.com/style-guide/section-navigation.html) gives recommendations for the accessible components.

@## Other recommendations

See more accessibility recommendations in the common [Accessibility guide](/core-principles/a11y/).
