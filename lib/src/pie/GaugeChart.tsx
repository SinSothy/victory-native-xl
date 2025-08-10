import * as React from "react";
import { vec, type Color } from "@shopify/react-native-skia";
import { PieSlice, type PieSliceData } from "./PieSlice";
import { handleTranslateInnerRadius } from "./utils/innerRadius";
import { PieSliceProvider } from "./contexts/PieSliceContext";
import { usePolarChartContext } from "../polar/contexts/PolarChartContext";

const DEFAULT_GAUGE_SWEEP_DEGREES = 180; // half circle by default

type GaugeChartProps = {
  children?: (args: { slice: PieSliceData }) => React.ReactNode;
  innerRadius?: number | string;
  gaugeSweepDegrees?: number; // how much of a circle to draw
  startAngle?: number; // starting angle offset
  size?: number;
};

export const GaugeChart = (props: GaugeChartProps) => {
  const {
    innerRadius = 0.7, // often a thicker band
    gaugeSweepDegrees = DEFAULT_GAUGE_SWEEP_DEGREES,
    startAngle: _startAngle = -90, // start from bottom center
    children,
    size,
  } = props;

  const {
    canvasSize,
    data: _data,
    labelKey,
    valueKey,
    colorKey,
  } = usePolarChartContext();

  const totalValue = _data.reduce(
    (sum, entry) => sum + Number(entry[valueKey]), 0);

  const width = size ?? canvasSize.width;
  const height = size ?? canvasSize.height;

  // For gauges, we use radius = half of the smaller dimension
  const radius = Math.min(width, height) / 2;
  const center = vec(canvasSize.width / 2, canvasSize.height);

  const data = React.useMemo(() => {
    let startAngle = _startAngle;

    return _data.map((datum): PieSliceData => {
      const value = Number(datum[valueKey]);
      const label = String(datum[labelKey]);
      const color = datum[colorKey] as Color;

      const initialStartAngle = startAngle;
      const sweepAngle = (value / totalValue) * gaugeSweepDegrees;
      const endAngle = initialStartAngle + sweepAngle;

      startAngle += sweepAngle;

      return {
        value,
        label,
        color,
        innerRadius: handleTranslateInnerRadius(innerRadius, radius),
        startAngle: initialStartAngle,
        endAngle,
        sweepAngle,
        sliceIsEntireCircle:
          sweepAngle === gaugeSweepDegrees || _data.length === 1,
        radius,
        center,
      };
    });
  }, [
    valueKey,
    _data,
    totalValue,
    colorKey,
    labelKey,
    radius,
    center,
    innerRadius,
    gaugeSweepDegrees,
    _startAngle,
  ]);

  return data.map((slice, index) => (
    <PieSliceProvider key={index} slice={slice}>
      {children ? children({ slice }) : <PieSlice />}
    </PieSliceProvider>
  ));
};
