
import { MapNodeData, ComponentType } from './types';

export const LOCAL_STORAGE_KEY = 'wardley-maps';

export const EVOLUTION_STAGES: string[] = [
  'Genesis',
  'Custom Built',
  'Product (+rental)',
  'Commodity (+utility)',
];

export const DEFAULT_MAP_NODES: MapNodeData[] = [
  {
    id: 'ai_app',
    name: 'AI Application',
    value: 95,
    evolution: 50,
    type: ComponentType.Software,
    dependencies: ['app_backend'],
  },
  {
    id: 'app_backend',
    name: 'Application Backend',
    value: 85,
    evolution: 60,
    type: ComponentType.Software,
    dependencies: ['model_api'],
  },
  {
    id: 'model_api',
    name: 'AI Model API (e.g. Gemini)',
    value: 75,
    evolution: 65,
    type: ComponentType.Service,
    dependencies: ['model_serving'],
  },
  {
    id: 'model_serving',
    name: 'Model Serving Framework',
    value: 60,
    evolution: 55,
    type: ComponentType.Software,
    dependencies: ['orchestration', 'ml_framework'],
  },
  {
    id: 'orchestration',
    name: 'Container Orchestration (K8s)',
    value: 50,
    evolution: 70,
    type: ComponentType.Software,
    dependencies: ['containerization', 'cloud_compute'],
  },
  {
    id: 'containerization',
    name: 'Containerization (Docker)',
    value: 45,
    evolution: 80,
    type: ComponentType.Software,
    dependencies: ['cloud_compute'],
  },
  {
    id: 'ml_framework',
    name: 'ML Frameworks (PyTorch, TF)',
    value: 40,
    evolution: 65,
    type: ComponentType.Software,
    dependencies: ['hardware_sdk'],
  },
  {
    id: 'hardware_sdk',
    name: 'Hardware Drivers/SDK (CUDA)',
    value: 30,
    evolution: 60,
    type: ComponentType.Software,
    dependencies: ['accelerators'],
  },
  {
    id: 'cloud_compute',
    name: 'Cloud Compute (IaaS)',
    value: 25,
    evolution: 85,
    type: ComponentType.Service,
    dependencies: ['server_hardware', 'data_center'],
  },
  {
    id: 'accelerators',
    name: 'Hardware Accelerators (GPU/TPU)',
    value: 20,
    evolution: 58,
    type: ComponentType.Hardware,
    dependencies: ['server_hardware'],
  },
  {
    id: 'server_hardware',
    name: 'Server Hardware (CPU, RAM)',
    value: 10,
    evolution: 88,
    type: ComponentType.Hardware,
    dependencies: ['power'],
  },
  {
    id: 'data_center',
    name: 'Data Center',
    value: 8,
    evolution: 92,
    type: ComponentType.Service,
    dependencies: ['power'],
  },
  {
    id: 'power',
    name: 'Power',
    value: 2,
    evolution: 98,
    type: ComponentType.Service,
    dependencies: [],
  },
];