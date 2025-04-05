---
title: null
---


<!-- tsGuideRenderComment {"guide":{"id":"eVmHCG271","path":"","fragmentFolderPath":"index_frags"}} -->

# Welcome to the Docs Assembler Demo!

Docs Assembler is a tool that makes documentation easy to create, reuse, and explore — like building with blocks! This demo shows how it works with examples you can browse. As you click through options, it builds a custom article just for you, showing only the next steps to diagnose and solve your problem. We store the "building plans" (called maps) in the `tsmaps` folder and turn them into ready-to-read guides in the `docs` folder.

## Explore the Examples

### 1. A Simple Guide (A single path like a book)

This is a straightforward list of steps — like in a manual or recipe. It’s just one path from start to finish.  

[**Holly's Guide To Fix Red Dwarf Food Dispenser**](/RedDwarf/RedDwarfFoodDispenserFix) 

[**How Was This Built?**](./docs/branching-guide-how.md) (See the map behind it!)

### 2. A Simple Guide (But with markdown and variables)

A guide using markdown, images, step re-use, variables and self-adjusting relative-links:

[**HAL Robotics decode 2-Cell**](/HAL/decode/2-Cell)

[**How Was This Built?**](./docs/branching-guide-how.md) (See the map behind it!)

### 3. A Guide with Choices (Like a Tree)

This guide adapts to your situation. As you click options it builds a custom article for you that’s one clear path from start to finish, with just the steps ***you*** need.

[DeLorean Time Machine Technical Manual](/BackToTheFuture/DeLorean-Time-Machine-Technical-Manual)

[**How Was This Built?**](./docs/branching-guide-how.md) (See the map behind it!)

### 4. A Guide That Reuses Other Guides - Like Building Blocks

To the user this guide is the same as the one in 3. But for the author this is where the power of maps lies.  
And author can build a map on how to use a digital multi-meter and then re-use in multiple steps in a map for fixing a washing machine, or a car, or a lift.  
They build the steps for multi-meter map once. When they update that map it updates everywhere. 


Combine map re-use with shareable steps, variables, self-adjusting links, intellisense, validation, on top of markdown, git, vscode and GitHub Pages and it becomes a labour saving tool. 


Coming soon...

## How It Works

- **Maps**: The raw plans live in the [`tsmaps` folder](https://github.com/your-username/your-repo/tree/main/tsmaps). They’re like blueprints written in JSON.
- **Published Guides**: The finished, easy-to-read versions are in the [`docs` folder](https://github.com/your-username/your-repo/tree/main/docs), ready for you to use.
- **Docs Assembler**: Our tool turns maps into guides that adapt as you click, building a custom article with only the steps you need next. Past choices fade away, keeping it simple.

Want to peek behind the scenes? Check out the [Docs Assembler project](https://marketplace.visualstudio.com/items?itemName=docs-assembler) for more!
#### Notes

- Build sophisticated documentation with the tools you already know — VS Code, Git, and repositories — no XML required.
- version-controlled workflows
- Assemble Complex Docs Like Code — Fast, Flexible, and Git-Friendly.
- maps referencing maps
- Maps Referencing Maps: A Game-Changer
- Rethinking Documentation: How We Built an Alternative to DITA with VS Code and Git.
- harness VS Code and Git to build complex, maintainable docs
- This reduces cognitive overload and gets them to the fix faster,
- Built for VS Code, Git Repos and GitHub Pages
- A big thank you to Grok and Deepseek and their endless patience.

