---
title: Histogram chart
fileSource: d3-chart
tabName: Design
---

> Basic data visualization rules are described in the [Chart principles](/data-display/d3-chart).

@## Description

**Histogram chart** helps grouping numeric data for comparison by quantitative indicators. It shows the distribution of values.

Use histogram when you need to display the distribution of data sets by groups (for example, quantitative ranges).

**Important points to keep in mind when presenting data as a histogram:**

- Always start the Y-axis from zero.
- The axes should be clear to the user from the chart name. However, in cases where the chart name isn’t enough, you can denote the axes.
- Don't use too many colors to represent categories. One color or shades of one color is enough. However, you can always highlight a category if necessary.
- You can place histogram bars horizontally if the range names are long and there are many ranges.

> Difference from bar chart
>
> - Histogram chart are used to display distribution of data sets: how often values fall into quantitative ranges.
> - Bar chart displays the distribution of data sets by quality categories for comparison.
>
> `Histograms are used to show distributions of variables while bar charts are used to compare variables`, [source](https://www.forbes.com/sites/naomirobbins/2012/01/04/a-histogram-is-not-a-bar-chart/#93b29b6d775f).
>
> _For example, we want to compare revenues of five companies. In this case, we should use [bar chart](/data-display/bar-chart/)._
>
> If we want to compare the number of companies that earn from 0 to 10,000; from 10,000 to 20,000; from 20,000 to 30,000, etc., then we should use the histogram chart.
>
> - In statistics, a histogram is a visual representation of the probability density function of a random variable based on a sample.
> - Most often, in order to ease the perception, the width of the columns shall be the same size.

@## Appearance

If you need to display different categories of data within a dataset, use Stacked histogram chart.

### Vertical histogram chart

The bars have `border-radius` of 2px. Margin between the bar is minimal.

![](static/histogram.png)

![](static/histogram-stack.png)

### Horizontal histogram chart

The bars have `border-radius` of 2px. Margin between the bar is minimal.

![](static/histogram-horizontal.png)

![](static/histogram-horizontal-stack.png)

@## Color usage

- Use [color palette](/data-display/color-palette/) and follow the the recommendations it has.
- **You can color the histogram bars in different colors when this can be useful for easier reading of the chart.** But use it carefully. _For example, you need to highlight a certain gradation of ranges. In this case, you can choose the appropriate colors from the chart palette._

![colors in histogram](static/color-yes-no.png)

@## Legend and axes

As a rule, a histogram doesn't need a legend. You only need to clearly name the chart and in some cases you can add names to the axes.

![axes](static/axes.png)

@## Sorting of columns

Don't forget to use a reasonable order of values to distribute your data sets. For example, from the largest value to the smallest one, and if they represent months - from January to December, etc.

> You can't change the order of the bars on the histogram, depending on the size of bars on the `Y-axis`. This will make it harder to read the data.

![sorting in histogram](static/sort-yes-no.png)

@## Outliers

In some cases some of the values in our data are very different from the majority of values.

If you show this picture as it is, with a zero value on the `Y-axis`, then large values will draw all the attention to themselves, while the rest of the data will appear to be zero.

> **The bar has a minimum height of 2px.** It is necessary so that the column doesn't "disappear" if there are extremely large values next to it.

![outliers in histogram](static/outliers.png)

Possible solutions for such cases are described in the guide about bar charts, [see the section describing outliers](/data-display/bar-chart/). **The recommended solution is to make the scale logarithmic instead of linear.**

@## Interaction

When you hover over a column, we highlight it with `--chart-grid-bar-chart-hover`. The hover takes up half of the margin column on the right and left sides.

If the column is clickable, the cursor changes to `pointer`.

![](static/histogram.png)

@## Edge cases

Here you will find the states for some specific cases. All other "empty states" for widgets are specified in [Error & n/a widget states](/components/widget-empty/).

### Data for one range

- We display a single bar if we only have data for one range.
- In the missing data area, display `n/a` in the tooltip as well as the message that there are no data for this period.

![](static/na.png)

![](static/no-more-histogram-chart.png)

### Null values

If all the values on the chart are zero, then show 0 for them in the tooltip.

> **Zero is also data. 0 ≠ `n/a`.**

![](static/null-histogram-chart.png)

![](static/null-horizontal.png)

### A part of the chart contains no data

- Don’t display bars in the area without data.
- When you hover over a range without data, show the tooltip with the `n/a` value. We also recommend you to add a message, which explains why there is no data, and when it will be available (if possible).

![](static/histogram-partially.png)

![](static/hor-partially.png)

### Initial loading

When the chart is loading for the first time, show [Skeleton](/components/skeleton/) instead of the chart.

If the chart has a title, show it during loading. The user will have an idea of what is being loaded and whether they need to wait for the loading process to complete.

For more information about this state, refer to [Skeleton](/components/skeleton/).

Use the `--skeleton-bg` color token for the skeleton background color.

![](static/vert-skeleton.png)

![](static/hor-skeleton.png)

@## Usage in UX/UI

- Start the columns from zero.
- By comparing columns, we are actually comparing the length. If we don’t start the scale from zero, there will be a visual illusion.

Check out the charts below. In the wrong case, the scale doesn't start from zero, and it seems that the `Y value` is almost half as large as the `X value`. However, this isn’t true.

![](static/deception-yes-no.png)

@page histogram-chart-a11y
@page histogram-chart-api
@page d3-chart-changelog
