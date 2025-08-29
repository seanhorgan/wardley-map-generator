
import { SoftwareIcon, HardwareIcon, ServiceIcon } from "./components/icons";

export enum EvolutionStage {
  Genesis,
  Custom,
  Product,
  Commodity,
}

export enum ComponentType {
  Software,
  Hardware,
  Service
}

export interface MapNodeData {
  id: string;
  name: string;
  // Y-axis: 0 (invisible) to 100 (visible)
  value: number;
  // X-axis: 0 (genesis) to 100 (commodity)
  evolution: number;
  type: ComponentType;
  dependencies: string[];
}

export interface SavedMap {
  id: string;
  name: string;
  userNeedTitle: string;
  userNeedDescription: string;
  nodes: MapNodeData[];
  lastModified: number;
  copiedFromId?: string | null;
}
