# ByteForge Design System & Color Guide

This document establishes the official design philosophy, core principles, and color usage rules to ensure a beautiful, consistent, and premium aesthetic across the ByteForge application.

## 🌟 Core Design Principles

These principles guide every UI/UX decision we make. If a design violates these, it is not ByteForge.

### 1. Nature-First Aesthetic 🌿
We prioritize organic, earthen tones over synthetic or neon brights. The UI should feel like a well-tended garden—ordered, calm, and alive.
*   **Why**: To differentiate from sterile "SaaS" platforms and evoke a sense of grounding and sustainability.
*   **How**: Use Cream backgrounds instead of stark white. Use Forest/Sage instead of generic Blue/Green.

### 2. Contextual Identity 🎭
The interface respects the user's current mindset. We do not force a "one size fits all" look.
*   **Buyer Mode**: Is **Calm & Exploratory** (Forest/Sage).
*   **Seller Mode**: Is **Industrious & Urgent** (Terracotta).
*   **How**: The entire primary color theme shifts based on the active role, signaling a change in context instantly.

### 3. Clarity over Density 🔍
We minimize cognitive load. Information is presented in clear, distinct islands (capsules, cards) rather than dense tables or lists.
*   **How**: Use "Badges" and "Segments" for status and choices. Avoid hidden menus where simple toggles work better.

### 4. Premium Tactility ✨
Interactions should feel substantial.
*   **How**: Use subtle borders (`border-gray-200`), distinct hover states, and smooth transitions. Avoid "flat" design; give elements depth with shadows (`shadow-sm`) and ring offsets.

---

## 🎨 Color Palette Overview

Our palette is inspired by nature, utilizing organic tones to create a grounded yet modern feel.

### 1. Forest Green (Primary)
**Role:** Brand Identity, Primary Actions, Stability.
- **Scale**: Complete 50-900 range
- **Main**: `forest-600` (#1e4029)
- **Surface**: `forest-50` (#f0f7f2)
- **Text**: `forest-700` (#183320)

### 2. Sage Green (Secondary)
**Role:** Soft Accents, Success States, Harmony.
- **Scale**: Complete 50-900 range
- **Main**: `sage-500` (#567c4d)
- **Usage**: Secondary buttons, success badges, subtle backgrounds.
- **Pairing**: Works perfectly with Forest to add depth without contrast shock.

### 3. Terracotta (Accent / Action)
**Role:** High Visibility, "Seller" Mode, Call-to-Actions.
- **Scale**: Complete 50-900 range
- **Main**: `terracotta-500` (#d06d48)
- **Usage**: Use for elements that need to pop (e.g., "Sell Now", "Hot Item") and to distinctively brand the **Seller Dashboard**.
- **Vibe**: Energetic, warm, human.

### 4. Cream (Neutral / Surface)
**Role:** Backgrounds, Warmth, Notices.
- **Scale**: Complete 50-900 range
- **Main**: `cream-50` (#fdfbf7) for backgrounds, `cream-200` (#e8dfc9) for notices
- **Usage**: Replaces clinical white for page backgrounds to reduce eye strain and add a premium "paper" feel. Also used for informational/notice states.

---

## 📐 Usage Rules & Components

To maintain consistency, adhere to these assignments:

### 🔘 Buttons & Interactions

| Type | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| **Primary** | `bg-forest-600` text-white | `bg-sage-500` text-white | Main call to action (Save, Checkout). |
| **Secondary** | `bg-forest-50` text-forest-700 | `bg-white/10` text-white | Alternative actions (Cancel, Back). |
| **Accent** | `bg-terracotta-500` text-white | `bg-terracotta-500` text-white | Urgent or High-Value actions. |
| **Ghost** | Transparent, `hover:bg-gray-100` | Transparent, `hover:bg-gray-800` | Icon buttons, tertiary links. |

### 🏷️ Roles & Modes

*   **Buyer Mode**: Uses the **Forest/Sage** theme. Calming, shopping-focused.
*   **Seller Mode**: Uses the **Terracotta** theme. Action-oriented, business-focused.

### 🧩 UI Elements

*   **Inputs**:
    *   Border: `gray-300` (Default), `forest-500` (Focus).
    *   Background: `gray-50` (or `cream-50`).
*   **Cards**:
    *   Background: `white` (Shadow-sm) on top of `cream-50` page bg.
    *   Border: `gray-100` (Subtle).
*   **Status Badges**:
    *   Active/Good: `bg-sage-100 text-sage-800` (Success).
    *   Process/Info: `bg-forest-100 text-forest-800` (Brand aligned).
    *   Notice/Pending: `bg-cream-200 text-cream-800` (Informational, non-urgent).
    *   Error/Stop: `bg-red-100 text-red-800` (Standard alert).

*   **Toasts**:
    *   Success: `bg-forest-*` (Brand success).
    *   Error: `bg-red-*` (Critical alert).
    *   Info/Notice: `bg-cream-*` (General information, tips).

### 🌑 Dark Mode Strategy

*   **Backgrounds**: Shift to `gray-900` or `forest-950` (Very dark green).
*   **Primaries**: Shift Forest-600 to **Sage-500** (Lighter/Brighter) for readability.
*   **Surfaces**: `gray-800` with light borders (`gray-700`).

---

## 🚫 Anti-Patterns (Do Not Do)
1.  **Do not** use Terracotta for success messages (too close to red/warning).
2.  **Do not** mix Forest and Blue (unless generic info). Stick to the brand palette.
3.  **Do not** use pure black (`#000000`). Use `gray-900`.
