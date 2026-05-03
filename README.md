# Next Generation Motion Zone UX

**Live Demo:** [https://next-generation-motion-zone-ux-1073165315355.us-west1.run.app/](https://next-generation-motion-zone-ux-1073165315355.us-west1.run.app/)
**Product Requirements Document (PRD):** [View the PRD](./public/PRD.md)

This prototype application demonstrates and evaluates new interaction models for setting up motion detection zones in smart security cameras.

## Overview

Setting up motion zones is currently a significant friction point for users, often resulting in poor zone placement or abandonment. This leads to notification fatigue (false alerts) or missed events. This application provides interactive prototypes to explore different approaches to solving this problem.

## Prototypes Evaluated

1. **Ring App Current (Baseline)**: The standard 8-point polygon tool.
2. **Ring App with Initial AI Zone Recommendation**: Provides an intelligent default zone focusing on relevant areas while providing larger manipulation points for easier tweaking. *(Recommended approach)*
3. **User Draw Tool**: A freehand drawing tool to trace the desired area. *(Considered but not recommended)*
4. **10x10 Grid Overlay**: A grid system for toggling detection sectors. *(Considered but not recommended)*

## Getting Started

To run this prototype locally:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the development server using `npm run dev`.

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React (Icons)
