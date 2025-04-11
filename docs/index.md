---
title: null
---


<!-- tsGuideRenderComment {"guide":{"id":"f1fzxd16J","path":"","fragmentFolderPath":"index_frags"}} -->

# Modular Documentation

Docs Assembler is a VS Code extension that treats documentation as modular, reusable "maps". These are json-based trees where each step (node) pulls content from standalone markdown files. This structure allows you to:

 - Edit documentation in your preferred markdown editor.
 - Reuse markdown across multiple steps or maps.
 - Use variables to inject dynamic content — supported by IntelliSense.

Maps bring object-oriented principles cencapsulation, modularity, and reuse — to documentation. How maps work:

 - Root step: Entry point.
 - Branches: Decision paths — comprised of steps (if/then, troubleshooting flows)
 - Solutions: Resolution endpoints.
 - Exits: Open paths requiring resolution in parent maps.

Maps and steps are interchangeable components. A map without exits functions as a solution (a resolved endpoint). Substituting a step with a map incorporates all of its contents into that node. When a map is published, it recursively expands all nested maps, verifies the output, and generates a guide in Jekyll Markdown format compatible with GitHub Pages. Why it matters:

For Authors:

 - Define clear pathways for documentation, and organise into reusable units.
 - Single-source updates propagate everywhere.
 - Complex workflows stay editable.

For Users:

Imagine a mechanic diagnosing a forklift's hydraulic pump: they don't need the full manual — just a precise, tailored guide. Generated from the map's logic, this linear path of steps becomes a custom article, shareable via URL. It cuts cognitive load and speeds up repairs.

Explorer demos to see maps and guides in action.

## Simple Guide

The simplest guide, with fixed steps presented as an article - like a manual, book, or essay.

Example: [Holly's Guide To Fix Red Dwarf Food Dispenser](/RedDwarf/RedDwarfFoodDispenserFix) 

Map: [RedDwarfFoodDispenserFix.tsmap](https://github.com/MuddyTurnip/MuddyTurnip.github.io/blob/main/tsmaps/RedDwarf/%CE%9E%20RedDwarfFoodDispenserFix/RedDwarfFoodDispenserFix.tsmap)
Clone this [repo](https://github.com/MuddyTurnip/MuddyTurnip.github.io) and install the [extension](https://marketplace.visualstudio.com/items?itemName=netoftrees.documentation-assembler) to view the map.

## Simple Guide + Tools

Uses markdown, images, reusable steps, variables, and auto-adjusting links.

Example: [HAL Robotics decode 2-Cell](/HAL/decode/2-Cell)

Map: [2-Cell-decode.tsmap](https://github.com/MuddyTurnip/MuddyTurnip.github.io/blob/main/tsmaps/HAL/decode/%CE%9E%202-Cell-decode/2-Cell-decode.tsmap)
Clone this [repo](https://github.com/MuddyTurnip/MuddyTurnip.github.io) and install the [extension](https://marketplace.visualstudio.com/items?itemName=netoftrees.documentation-assembler) to view the map.

## Adaptive Guide

Adapts to your specific situation, generating a custom article with only the relevant steps.

Example: [DeLorean Time Machine Technical Manual](/BackToTheFuture/DeLorean-Time-Machine-Technical-Manual)

Map: [DeLoreanTimeMachineTechnicalManual.tsmap](https://github.com/MuddyTurnip/MuddyTurnip.github.io/blob/main/tsmaps/BackToTheFuture/%CE%9E%20DeLoreanTimeMachineTechnicalManual/DeLoreanTimeMachineTechnicalManual.tsmap)
Clone this [repo](https://github.com/MuddyTurnip/MuddyTurnip.github.io) and install the [extension](https://marketplace.visualstudio.com/items?itemName=netoftrees.documentation-assembler) to view the map.

## Guides within guides

Example: Coming soon...


