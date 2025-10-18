# Development Issue Log

This document tracks issues encountered during the development of the DocuNote application (formerly FileChat AI).

## Theme Switching Functionality

A series of issues were encountered while implementing the theme switching feature.

1.  **Initial Bug:** The theme could only be changed once. Subsequent selections would not work without a page refresh.
    *   **Resolution Attempt 1:** Converted `ThemeProvider` to a client component (`"use client"`). This did not fully resolve the issue.
    *   **Resolution Attempt 2:** Removed `suppressHydrationWarning` from the `<html>` tag, which led to a new error.

2.  **Hydration Error:** After attempting to fix the initial bug, a React hydration error occurred.
    *   **Symptom:** The server-rendered HTML for the `<html>` tag did not match the client-side rendered HTML.
    *   **Resolution:** Re-added the `suppressHydrationWarning` prop to the `<html>` tag in `src/app/layout.tsx`. This is the correct approach for `next-themes`.

3.  **"Gray" Theme Freezing:** Selecting the "Gray" theme option would prevent any further theme changes.
    *   **Symptom:** The application would get "stuck" in the gray theme state.
    *   **Cause:** The `DropdownMenuItem` for the "Gray" theme was missing its `onClick={() => setTheme("gray")}` event handler.
    *   **Resolution:** Added the missing `onClick` handler to `src/components/theme-toggle.tsx`.

4.  **"Gray" Theme Styles Not Applying:** After fixing the freezing issue, the "Gray" theme's colors would not apply.
    *   **Cause 1:** The `ThemeProvider` in `src/app/layout.tsx` was not configured to recognize the "gray" theme.
    *   **Resolution 1:** Added `"gray"` to the `themes` array in the `ThemeProvider` props.
    *   **Cause 2:** The `attribute` prop on `ThemeProvider` was set to `"class"` while the CSS was expecting `[data-theme]`.
    *   **Resolution 2:** Changed the `attribute` prop to `"data-theme"`.
    *   **Cause 3:** The CSS in `globals.css` used an incorrect selector (`html[data-theme="gray"] { ... }` was mistakenly something else).
    *   **Resolution 3:** Corrected the CSS selector to `html[data-theme='gray']`.

5.  **"Dark" Theme Failure:** Selecting the "Dark" theme would result in the light theme being applied.
    *   **Cause:** The CSS selector for the dark theme in `globals.css` was `.dark` instead of the correct `html[data-theme='dark']`.
    *   **Resolution:** Updated the CSS selector to match the `data-theme` attribute.

6.  **Theme Icon Not Updating:** The sun/moon icon in the theme toggle button did not change to reflect the current theme.
    *   **Cause:** The `tailwind.config.ts` was configured with `darkMode: ['class']`, but the application was using the `data-theme` attribute.
    *   **Resolution:** Updated `tailwind.config.ts` to `darkMode: ['attr', 'data-theme']` to allow Tailwind's `dark:` utility to work with the `data-theme="dark"` attribute. The issue persisted and was finally resolved by conditionally rendering the icons based on the `useTheme` hook's state.

## AI Theme Generation

1.  **AI-Generated Background Not Updating:** After generating one AI theme with a background, subsequent theme generations would not change the background image in the "Sources" panel.
    *   **Cause:** The component logic was not correctly handling the removal of previously generated AI theme styles. Old `<style>` tags were being left in the document head, causing CSS conflicts.
    *   **Resolution:** Modified the `handleGenerate` function in `ai-theme-generator.tsx` to query and remove any `style` elements with an ID starting with `theme-ai-` before appending the new one.
