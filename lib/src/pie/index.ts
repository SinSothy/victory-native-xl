import { GaugeChart } from "./GaugeChart";
import { PieChart } from "./PieChart";
import PieLabel from "./PieLabel";
import { PieSlice, type PieSliceData } from "./PieSlice";
import { PieSliceAngularInset } from "./PieSliceAngularInset";

const Pie = {
  Chart: PieChart,
  GaugeChart: GaugeChart,
  Slice: PieSlice,
  Label: PieLabel,
  SliceAngularInset: PieSliceAngularInset,
};

export { Pie, type PieSliceData };
