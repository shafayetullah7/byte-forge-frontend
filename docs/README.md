# ByteForge Frontend Documentation

Welcome to the ByteForge frontend documentation!

## Quick Links

### Design System
- [**Design System Overview**](./DESIGN_SYSTEM.md) - Core principles and guidelines
- [Routing Guidelines](./guidelines/ROUTING.md) - How to structure routes

### Components
- [RoleSwitcher](./components/ROLE_SWITCHER.md) - Switch between buyer/seller modes
- [ShopSelector](./components/SHOP_SELECTOR.md) - Select active shop (seller mode)
- More components coming soon...

### Guidelines
- [Routing](./guidelines/ROUTING.md) - Route structure and best practices
- Accessibility (coming soon)
- Mobile Design (coming soon)
- Internationalization (coming soon)

## Getting Started

1. Read the [Design System Overview](./DESIGN_SYSTEM.md)
2. Understand [Routing Guidelines](./guidelines/ROUTING.md)
3. Review component documentation before building
4. Follow the testing checklist before shipping

## Key Principles

1. **Mental Model Separation** - Never mix buyer and seller contexts
2. **Explicit Routing** - Routes must clearly indicate context
3. **Context Visibility** - Always show current role and shop
4. **Manual Role Switching** - No auto-switching without user intent
5. **Shop Context First-Class** - Active shop always visible in seller mode

## Contributing

When adding new features:

1. Check existing patterns first
2. Follow routing rules (explicit context)
3. Update documentation
4. Add to component library if reusable
5. Use the testing checklist

## Questions?

- Check the [Design System](./DESIGN_SYSTEM.md)
- Review [Component Docs](./components/)
- Look at [Pattern Examples](./patterns/) (coming soon)
