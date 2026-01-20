import * as echarts from 'echarts/core'

import {
    BarChart,
    FunnelChart,
    GaugeChart,
    LineChart,
    MapChart,
    PictorialBarChart,
    PieChart,
    RadarChart
} from 'echarts/charts'

import {
    AriaComponent,
    GridComponent,
    LegendComponent,
    ParallelComponent,
    PolarComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapComponent,
    // 数据集组件
    DatasetComponent,
} from 'echarts/components'

import { CanvasRenderer } from 'echarts/renderers'

import type {
    // 系列类型的定义后缀都为 SeriesOption
    BarSeriesOption,
    FunnelSeriesOption,
    GaugeSeriesOption,
    LineSeriesOption,
    MapSeriesOption,
    PictorialBarSeriesOption,
    PieSeriesOption,
    RadarSeriesOption,
} from 'echarts/charts';

import type {
    // 组件类型的定义后缀都为 ComponentOption
    AriaComponentOption,
    GridComponentOption,
    LegendComponentOption,
    ParallelComponentOption,
    PolarComponentOption,
    TitleComponentOption,
    ToolboxComponentOption,
    TooltipComponentOption,
    VisualMapComponentOption,
    DatasetComponentOption
} from 'echarts/components';
import type {
    ComposeOption,
} from 'echarts/core';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = ComposeOption<
    | BarSeriesOption
    | FunnelSeriesOption
    | GaugeSeriesOption
    | LineSeriesOption
    | MapSeriesOption
    | PictorialBarSeriesOption
    | PieSeriesOption
    | RadarSeriesOption
    | AriaComponentOption
    | GridComponentOption
    | LegendComponentOption
    | ParallelComponentOption
    | PolarComponentOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
    | VisualMapComponentOption
    | DatasetComponentOption
>
echarts.use([
    LegendComponent,
    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    GridComponent,
    PolarComponent,
    AriaComponent,
    ParallelComponent,
    VisualMapComponent,
    BarChart,
    LineChart,
    PieChart,
    MapChart,
    CanvasRenderer,
    PictorialBarChart,
    RadarChart,
    GaugeChart,
    FunnelChart,
    DatasetComponent
])

export default echarts
