---
description: Fully assembled component examples with annotated rule sources — product card, dashboard shell, form modal
---

# ByteForge Golden Examples

> These examples show how rules from multiple files combine into complete components.
> Each class is annotated with the source rule file.

---

## 1. Product Card (Browse Grid)

```html
<!-- CONTAINER -->
<div
  class="
    bg-white                          <!-- /light-theme §Surface: card bg -->
    dark:bg-forest-800                <!-- /dark-theme §Surface: card bg -->
    border border-cream-200           <!-- /light-theme §Border: default -->
    dark:border-forest-700            <!-- /dark-theme §Border: default -->
    rounded-xl                        <!-- /style-guide §2: shape language -->
    shadow-sm                         <!-- /light-theme §Shadow: subtle -->
    dark:shadow-none                  <!-- /dark-theme §Shadow: prefer borders -->
    hover:shadow-md                   <!-- /light-theme §Shadow: hover lift -->
    hover:border-cream-300            <!-- /light-theme §Card: hover -->
    dark:hover:border-forest-600      <!-- /dark-theme §Card: hover -->
    transition-all duration-200       <!-- /style-guide §5: motion budget -->
    overflow-hidden                   <!-- clip image corners -->
  "
>
  <!-- IMAGE -->
  <div class="aspect-square">         <!-- /layout-rules §9: product = 1:1 -->
    <img
      class="w-full h-full object-cover"  <!-- /layout-rules §9: always cover -->
      loading="lazy"                       <!-- /layout-rules §9: below fold -->
      alt="Monstera Deliciosa"             <!-- /layout-rules §9: descriptive alt -->
    />
  </div>

  <!-- CONTENT -->
  <div class="p-4 sm:p-5 space-y-2">     <!-- /style-guide §3: card padding -->
    <h3 class="
      text-base font-semibold              <!-- /style-guide §1: card title -->
      text-forest-800                      <!-- /light-theme §Text: primary -->
      dark:text-cream-50                   <!-- /dark-theme §Text: primary -->
    ">Monstera Deliciosa</h3>

    <p class="
      text-sm                              <!-- /style-guide §1: supporting -->
      text-gray-500                        <!-- /light-theme §Text: tertiary -->
      dark:text-gray-400                   <!-- /dark-theme §Text: tertiary -->
    ">Indoor tropical plant</p>

    <div class="flex items-center justify-between">
      <span class="
        text-lg font-bold                  <!-- /style-guide §1: price -->
        text-forest-700                    <!-- /light-theme §Text: secondary -->
        dark:text-gray-300                 <!-- /dark-theme §Text: secondary -->
      ">$45.00</span>

      <button class="
        bg-terracotta-500                  <!-- /light-theme §Button: CTA -->
        dark:bg-terracotta-500             <!-- /dark-theme §Button: CTA -->
        hover:bg-terracotta-600            <!-- /light-theme §Button: CTA hover -->
        dark:hover:bg-terracotta-400       <!-- /dark-theme §Button: CTA hover -->
        text-white rounded-lg              <!-- /style-guide §2: shape -->
        px-4 py-2 text-sm font-medium      <!-- /style-guide §3: button padding -->
        transition-colors duration-200     <!-- /style-guide §5: motion -->
        min-h-[44px]                       <!-- /layout-rules §4: touch target -->
      ">Add to Cart</button>
    </div>
  </div>
</div>
```

**Rule files used:** `/style-guide` §1,2,3,5 · `/light-theme-design` §Surface,Text,Border,Shadow,Button · `/dark-theme-design` §Surface,Text,Border,Button · `/layout-rules` §4,9

---

## 2. Seller Dashboard Shell

```html
<!-- ROOT: /layout-rules §1 Seller Dashboard + §5 Scroll -->
<div class="h-screen flex overflow-hidden bg-cream-50 dark:bg-forest-900">

  <!-- SIDEBAR: /layout-rules §2 seller = w-64 -->
  <aside class="
    fixed inset-y-0 left-0 z-50       <!-- /layout-rules §3: sidebar panel z-50 -->
    w-64                               <!-- /layout-rules §2: seller sidebar -->
    bg-white dark:bg-forest-800        <!-- /light-theme + /dark-theme §Navigation -->
    border-r border-cream-200          <!-- /light-theme §Border -->
    dark:border-forest-700             <!-- /dark-theme §Border -->
    overflow-y-auto                    <!-- /layout-rules §5: sidebar scrolls -->
    transform transition-transform     <!-- /style-guide §5: motion -->
    lg:translate-x-0 lg:relative       <!-- /layout-rules §4: persistent on desktop -->
  ">
    <!-- Nav items... -->
  </aside>

  <!-- CONTENT COLUMN -->
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

    <!-- TOPBAR: /layout-rules §2 = h-14 -->
    <header class="
      h-14 sticky top-0 z-10          <!-- /layout-rules §2,3: topbar height + z -->
      bg-white dark:bg-forest-800      <!-- /light-theme + /dark-theme §Nav -->
      border-b border-cream-200        <!-- /light-theme §Border -->
      dark:border-forest-700           <!-- /dark-theme §Border -->
      flex items-center px-4 sm:px-6 lg:px-8
    ">
      <!-- Topbar content... -->
    </header>

    <!-- MAIN: /layout-rules §1 seller = max-w-7xl -->
    <main class="
      flex-1 overflow-y-auto           <!-- /layout-rules §5: content scrolls -->
      px-4 sm:px-6 lg:px-8 py-6       <!-- /layout-rules §2: content padding -->
    ">
      <div class="max-w-7xl mx-auto">  <!-- /layout-rules §2: seller max-width -->
        <!-- Page content... -->
      </div>
    </main>
  </div>
</div>
```

**Rule files used:** `/layout-rules` §1,2,3,4,5 · `/light-theme-design` §Surface,Border,Nav · `/dark-theme-design` §Surface,Border,Nav · `/style-guide` §5

---

## 3. Form Modal

```html
<!-- BACKDROP: /layout-rules §6 -->
<div class="
  fixed inset-0 z-[60]                <!-- /layout-rules §3,6: modal backdrop -->
  bg-black/40                          <!-- /layout-rules §6: nursery-soft -->
  flex items-center justify-center
">
  <!-- MODAL PANEL -->
  <div class="
    z-[65]                             <!-- /layout-rules §3: modal content -->
    max-w-lg w-full                    <!-- /layout-rules §6: 1-4 inputs = lg -->
    mx-3 my-4 sm:mx-auto              <!-- /layout-rules §6: mobile margins -->
    bg-white dark:bg-forest-800        <!-- /light-theme + /dark-theme §Surface -->
    border border-cream-200            <!-- /light-theme §Border -->
    dark:border-forest-700             <!-- /dark-theme §Border -->
    rounded-xl                         <!-- /style-guide §2: shape -->
    shadow-lg dark:shadow-md dark:shadow-black/30  <!-- theme §Shadow -->
    p-6 sm:p-8                         <!-- /layout-rules §6: modal padding -->
  ">
    <!-- HEADER -->
    <h2 class="
      text-xl font-semibold            <!-- /style-guide §1: section title -->
      text-forest-800 dark:text-cream-50
      mb-6
    ">Add New Plant</h2>

    <!-- FORM: /layout-rules §7 -->
    <form class="space-y-4">           <!-- /layout-rules §7: field spacing -->
      <div>
        <label class="
          text-sm font-medium          <!-- /light-theme §Input: label -->
          text-forest-700 dark:text-gray-300
          mb-1.5 block                 <!-- /layout-rules §7: label → input gap -->
        ">Plant Name <span class="text-red-500">*</span></label>
        <input
          type="text"
          class="
            w-full rounded-lg          <!-- /style-guide §2: shape -->
            bg-white dark:bg-forest-700 <!-- /dark-theme §Input: above card bg -->
            border border-cream-300     <!-- /light-theme §Input -->
            dark:border-forest-600      <!-- /dark-theme §Input -->
            text-forest-800 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:border-forest-500 focus:ring-2 focus:ring-forest-200
            dark:focus:border-forest-400 dark:focus:ring-forest-700
            px-4 py-2.5                <!-- /style-guide §3: input padding -->
          "
          placeholder="e.g. Monstera Deliciosa"
        />
      </div>
      <!-- More fields... -->

      <!-- ACTIONS: /layout-rules §7 -->
      <div class="
        flex flex-col-reverse sm:flex-row  <!-- /layout-rules §7: mobile stack -->
        justify-end gap-3 pt-4
      ">
        <button class="
          bg-forest-50 dark:bg-forest-700  <!-- /light+dark §Button: secondary -->
          text-forest-700 dark:text-gray-200
          hover:bg-forest-100 dark:hover:bg-forest-600
          rounded-lg px-4 py-2.5
          transition-colors duration-200
          min-h-[44px]                     <!-- /layout-rules §4: touch target -->
        ">Cancel</button>
        <button class="
          bg-forest-600 dark:bg-forest-500 <!-- /light+dark §Button: primary -->
          hover:bg-forest-700 dark:hover:bg-forest-400
          text-white rounded-lg px-4 py-2.5
          transition-colors duration-200
          min-h-[44px]
        ">Save Plant</button>
      </div>
    </form>
  </div>
</div>
```

**Rule files used:** `/layout-rules` §3,4,6,7 · `/light-theme-design` §Surface,Border,Input,Button · `/dark-theme-design` §Surface,Border,Input,Button · `/style-guide` §1,2,3
