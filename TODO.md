# Categories UI Redesign Task

## Overview
Redesign the Categories page with a complete layout change to properly handle 3-level category hierarchy (Category > Subcategory > Child Subcategory) with improved UX.

## Tasks
- [ ] Replace card grid layout with hierarchical table view
- [ ] Add expand/collapse functionality for categories and subcategories
- [ ] Implement proper indentation to show parent-child relationships
- [ ] Add level indicators and visual hierarchy
- [ ] Improve action placement and accessibility
- [ ] Ensure responsive design for mobile/tablet
- [ ] Maintain existing stats cards at the top
- [ ] Test expand/collapse functionality across all levels

## Implementation Details
- Flatten category data into table-friendly format
- Use state management for expanded/collapsed sections
- Create table component with proper indentation (16px per level)
- Add chevron icons for expandable rows
- Include product counts and action buttons per row
- Maintain existing dialog modals for add/edit operations
