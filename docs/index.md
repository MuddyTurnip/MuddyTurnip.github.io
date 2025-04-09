---
title: null
---


<!-- tsGuideRenderComment {"guide":{"id":"epvs1z1Av","path":"","fragmentFolderPath":"index_frags"}} -->

# Modular Documentation

Docs Assembler is a VS Code extension that treats documentation as modular, reusable "maps" — JSON-based trees where each step (node) pulls content from standalone markdown files.

### This structure allows you to:

 - Edit documentation in your preferred markdown editor.
 - Reuse markdown across multiple steps or maps.
 - Use variables to inject dynamic content — supported by IntelliSense.

Maps bring object-oriented principles — encapsulation, modularity, and reuse — to documentation.

### How maps work:

 - Root step: Entry point.
 - Branches: Decision paths (if/then, troubleshooting flows).
 - Solutions: Resolution endpoints.
 - Open paths requiring resolution in parent maps.

The publish routine validates maps and converts them into formats like Jekyll Markdown for GitHub Pages — guides.

### Why it matters:

For Authors:

 - Maps provide a structured way to define pathways.
 - Single-source updates propagate everywhere.
 - Complex workflows stay editable.

For Users:

Imagine a mechanic diagnosing a forklift's hydraulic pump: they don't need the full manual — just a precise, tailored guide. Generated from the map's logic, this linear path of steps becomes a custom article, shareable via URL. It cuts cognitive load and speeds up repairs.

Explorer demos to see maps and guides in action.

## Simple Guide

The simplest guide, with fixed steps presented as an article - like a manual, book, or essay.

Example: [Holly's Guide To Fix Red Dwarf Food Dispenser](/RedDwarf/RedDwarfFoodDispenserFix) 


## Simple Guide + Tools

Uses markdown, images, reusable steps, variables, and auto-adjusting links.

Example: [HAL Robotics decode 2-Cell](/HAL/decode/2-Cell)

## Adaptive Guide

Adapts to your specific situation, generating a custom article with only the relevant steps.

Example: [DeLorean Time Machine Technical Manual](/BackToTheFuture/DeLorean-Time-Machine-Technical-Manual)

##
# Guides within guides

Example: Coming soon...


