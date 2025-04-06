---
title: null
---


<!-- tsGuideRenderComment {"guide":{"id":"ed3S1K0ol","path":"","fragmentFolderPath":"index_frags"}} -->

# Docs Assembler Demo

Docs Assembler turns documentation into modular, reusable units called "maps." This demo shows how it works with examples you can explore. Click through options to build a custom article with only the steps you need. Maps are stored in the tsmaps folder; finished guides are in the docs folder, optimised up for GitHub Pages.


## A Simple Guide

The simplest guide, with fixed steps presented as an article - like a manual, book, or essay.

Example: [Holly's Guide To Fix Red Dwarf Food Dispenser](/RedDwarf/RedDwarfFoodDispenserFix) 


## Simple Guide + Tools

Uses markdown, images, reusable steps, variables, and auto-adjusting links.

Example: [HAL Robotics decode 2-Cell](/HAL/decode/2-Cell)

## Adaptive Guide

Adapts to your specific situation, generating a custom article with only the relevant steps.

Example: [DeLorean Time Machine Technical Manual](/BackToTheFuture/DeLorean-Time-Machine-Technical-Manual)

## Guides within guides

This is where maps shine. Authors can break knowledge into modular blocks and assemble them like Lego. Maps can have exits so can be chained and nested. For instance, a map on using a digital multi-meter, could plug into maps for diagnosing and fixing electrical faults in other products, like washing machines, or cars. Any updates to the digital multi-meter map cascade to the referencing maps automatically. Inspired by software classes, maps bring encapsulation and reuse to documentation trees.

Example: Coming soon...
## Docs Assembler

Docs Assembler is a VS Code extension that reimagines documentation as modular, reusable code-like units called "maps." Maps are JSON-based trees with a root (entry point), branches (decision paths), solutions (endpoints), and exits (hooks for extension), functioning like software classes with encapsulation and reuse. Authors create maps (e.g., "Diagnose Hydraulic Pump Failure") as self-contained help blocks, editable in a graphical or JSON editor, with steps linking to Markdown assets and variables for re-use. Maps can reference other maps, enabling single-point updates across help systems. Users see simplified, situation-specific paths (e.g., "Run diagnostics > Check seal > Replace seal") without the tree’s complexity. A publish routine validates and converts maps into formats like Jekyll Markdown for GitHub Pages, while a user app builds custom articles from selected options.

