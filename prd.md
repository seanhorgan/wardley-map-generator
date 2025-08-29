# Product Requirements Document: Interactive Wardley Map Generator

## 1. Introduction

This document outlines the product requirements for the Interactive Wardley Map Generator. This web-based application provides users with a tool to visualize, create, modify, save, and share Wardley Maps. The goal is to create an intuitive, persistent, and shareable tool for strategic planning and value chain analysis.

## 2. Target Audience

*   **Business Strategists:** To map out market landscapes, identify opportunities, and plan strategic plays.
*   **Product Managers:** To understand the value chain of their products and make informed decisions about technology choices (build vs. buy).
*   **Engineers & Architects:** To visualize system architecture, dependencies, and the evolutionary state of different components.
*   **Students & Educators:** To learn and teach the concepts of Wardley Mapping.

## 3. Core Features & Requirements

### 3.1. Map Visualization
*   **FR-1.1:** The application shall render a Wardley Map with a vertical "Value Chain" axis and a horizontal "Evolution" axis.
*   **FR-1.2:** The Value Chain axis shall range from "Invisible" at the bottom to "Visible" at the top.
*   **FR-1.3:** The Evolution axis shall be divided into four distinct stages: "Genesis," "Custom Built," "Product (+rental)," and "Commodity (+utility)."
*   **FR-1.4:** The map must display a "User Need" as the anchor at the top of the value chain.
*   **FR-1.5:** Components (nodes) on the map must be visually distinct based on their type (e.g., Software, Hardware, Service), using unique icons and colors.
*   **FR-1.6:** The application shall draw lines between nodes to represent dependencies.

### 3.2. Interactivity & Editing
*   **FR-2.1: Reposition Nodes:** Users must be able to change a node's position on the map by dragging and dropping it. This updates both its value and evolution properties.
*   **FR-2.2: Edit Node Name:** Users must be able to edit the name of a node by double-clicking it, which reveals an inline text input.
*   **FR-2.3: Add Nodes:** The UI must provide a button to add a new, default component to the map.
*   **FR-2.4: Remove Nodes:** Users must be able to remove a node from the map. This action should also remove any dependency lines connected to it. A remove button shall appear when hovering over a node.
*   **FR-2.5: Remove Dependencies:** Users must be able to remove a single dependency line by clicking on it. The line should provide visual feedback on hover.
*   **FR-2.6: Add Dependencies:** Users must be able to create a dependency between two nodes via a "drawing mode," which provides clear visual feedback for selecting source and destination nodes.
*   **FR-2.7: Edit User Need:** Users must be able to edit the title and description of the User Need anchor through an in-place editing interface.

### 3.3. Map Management & Persistence
*   **FR-3.1: Persistence:** All maps and their changes must be automatically saved to the browser's local storage.
*   **FR-3.2: Create New Map:** Users must be able to create a new, blank map. This new map will become the active map.
*   **FR-3.3: View All Maps:** Users must be able to open a management panel (e.g., a sidebar) that lists all their saved maps.
*   **FR-3.4: Load Map:** From the management panel, users must be able to load any map, making it the active map for viewing and editing.
*   **FR-3.5: Delete Map:** From the management panel, users must be able to permanently delete any map. A confirmation prompt must be shown before deletion.
*   **FR-3.6: Rename Map:** Users must be able to edit the title of the currently active map.
*   **FR-3.7: Copy Map:** Users must be able to create a duplicate of the currently active map. The new copy will become the active map and should contain a reference to the original map's ID in its data.

### 3.4. Sharing
*   **FR-4.1: Unique URLs:** Each map must have a unique, persistent, and shareable URL.
*   **FR-4.2: URL Loading:** Accessing a map's unique URL must directly load that specific map into the application view.

### 3.5. User Assistance
*   **FR-5.1: In-app Help System:** The application must provide an accessible help panel or modal that explains all major features, including node manipulation, dependency management, map management, and sharing.

## 4. Application Data Structure

### 4.1. Map Node Input
The primary input for rendering the map is a collection (an array) of node data objects. Each object must conform to the following structure:

```typescript
interface MapNodeData {
  id: string;      // Unique identifier for the node
  name: string;    // Display name of the component
  value: number;   // Y-axis position (0-100)
  evolution: number; // X-axis position (0-100)
  type: ComponentType; // Enum: Software, Hardware, Service
  dependencies: string[]; // Array of node IDs this component depends on
}
```

### 4.2. Saved Map Structure
The application persists an array of `SavedMap` objects in local storage.

```typescript
interface SavedMap {
  id: string;                 // Unique identifier for the map
  name: string;               // Display name of the map
  userNeedTitle: string;      // The title for the user need section
  userNeedDescription: string;// The description for the user need section
  nodes: MapNodeData[];       // Array of all nodes belonging to the map
  lastModified: number;       // Unix timestamp of the last change
  copiedFromId?: string | null; // Optional ID of the map it was copied from
}
```

## 5. User Interface (UI) & User Experience (UX)

*   **UI-1:** The application will use a modern, dark-themed aesthetic.
*   **UI-2:** The layout will be responsive and usable across a range of screen sizes.
*   **UX-1:** All interactive elements must provide clear visual feedback on hover and click states.
*   **UX-2:** User actions should feel instantaneous and smooth, with automatic background saving.
*   **UX-3:** Helper text should be present to guide new users on how to interact with the map's features.
*   **UX-4:** The map management panel shall be intuitive, allowing users to easily find, load, and delete their work.
