# Statistical Analysis

## Load Data

### Introduction to Required Libraries {.unnumbered}

To embark on sentiment analysis within the fast fashion industry, we must first set the stage with the right tools. This involves loading several R libraries, each serving a unique purpose in our data analysis journey.


```r
# Loading the required libraries
library(tidyverse)  # For data manipulation and visualization
#> Warning: package 'tidyverse' was built under R version
#> 4.3.3
#> ── Attaching core tidyverse packages ──── tidyverse 2.0.0 ──
#> ✔ dplyr     1.1.4     ✔ readr     2.1.4
#> ✔ forcats   1.0.0     ✔ stringr   1.5.1
#> ✔ ggplot2   3.4.4     ✔ tibble    3.2.1
#> ✔ lubridate 1.9.3     ✔ tidyr     1.3.0
#> ✔ purrr     1.0.2     
#> ── Conflicts ────────────────────── tidyverse_conflicts() ──
#> ✖ dplyr::filter() masks stats::filter()
#> ✖ dplyr::lag()    masks stats::lag()
#> ℹ Use the conflicted package (<http://conflicted.r-lib.org/>) to force all conflicts to become errors
library(tidytext)   # For text mining tasks
library(lubridate)  # For manipulating date-time data
library(textdata)   # To access the NRC sentiment lexicon
#> Warning: package 'textdata' was built under R version 4.3.3
```

The `tidyverse` collection of packages offers a versatile suite for data manipulation and visualization, streamlining many routine data analysis tasks. `tidytext` provides specialized functions for text mining, a vital step in sentiment analysis. With `lubridate`, handling and interpreting date-time information becomes intuitive, enhancing our ability to analyze trends over time. Lastly, `textdata` grants us access to various lexicons and text datasets, such as the NRC Word-Emotion Association Lexicon, an essential resource for quantifying the sentiment conveyed by text.

### Data Ingestion {.unnumbered}

The analysis begins by sourcing tweet datasets corresponding to several key players in the fast fashion industry.


```r
# Reading in the data for each brand
gap <- read.csv("data/gap.csv")
hm <- read.csv("data/hm.csv")
uniqlo <- read.csv("data/uniqlo_uk.csv")
zara <- read.csv("data/zara.csv")
```

In this step, we read the tweet data for each brand from CSV files into R. Each dataset contains a wealth of information extracted from social media, serving as a rich source for sentiment analysis.

### Data Annotation {.unnumbered}

Once the datasets are loaded, we need to distinguish tweets from each brand within our unified analysis framework.


```r
# Annotating data with brand names
gap$brand <- "Gap"
hm$brand <- "H&M"
uniqlo$brand <- "UNIQLO"
zara$brand <- "ZARA"
```

In the forthcoming section, we delve into statistical analyses pivotal for social media analytics, particularly within the domain of fast fashion. Utilizing R, a prominent statistical computing environment, we explore measures of central tendency—mean, median, and mode—each shedding light on different facets of social media engagement data. These analyses are instrumental in understanding patterns, trends, and outliers in social media behavior, thereby offering valuable insights for strategic planning and content optimization.

### Setting the Stage with R

First, we prepare our R environment to ensure clarity in our numerical outputs, eschewing scientific notation for readability:

```r
options(scipen = 999)
```

This command, `options(scipen = 999)`, adjusts R's preference for displaying numbers, making it favor plain numeric representation over scientific notation. This is particularly helpful when dealing with social media metrics, which can range from small to large values but are more intuitively understood in their standard form.

### Analyzing Likes: Mean Calculation

Our exploration begins with the calculation of the mean number of likes for posts within a dataset labeled `fast_fashion_nrc`:

```r
mean_likes <- fast_fashion_nrc %>%
  summarise(mean = mean(Likes_Count, na.rm = TRUE))

mean_likes
```

Output:
```
mean
<dbl>
106.2683
```

The `mean(Likes_Count, na.rm = TRUE)` function computes the average number of likes per post, explicitly instructing R to ignore any missing values (`na.rm = TRUE`). The resulting mean of 106.2683 signifies that, on average, posts in this dataset received approximately 106 likes. This average is a fundamental descriptor, providing a snapshot of engagement levels, yet it doesn't account for the distribution's shape or outliers.

### Exploring Post Length: Median Calculation

Subsequently, we assess the median post length:

```r
median_length <- fast_fashion_nrc %>%
  summarise(median = median(Post_Length, na.rm = TRUE))

median_length
```

Output:
```
median
<dbl>
132
```

Here, `median(Post_Length, na.rm = TRUE)` calculates the middle value in the distribution of post lengths, again excluding missing values. The median of 132 suggests that half the posts are shorter and half are longer than this value. Unlike the mean, the median is less sensitive to extreme values, offering a robust measure of central tendency for skewed distributions.

### Investigating Replies: Mode Calculation

Lastly, we explore the mode of replies count:

```r
library(DescTools)

mode_replies <- Mode(fast_fashion_nrc$Replies_Count)

mode_replies
```

Output:
```
[1] 280
attr(,"freq")
[1] 286
```

The `Mode(fast_fashion_nrc$Replies_Count)` function from the `DescTools` package identifies the most frequent number of replies received by posts, which, in this case, is 280. This frequency is corroborated by the attribute `freq`, showing that 286 posts received exactly 280 replies each. The mode, particularly relevant in categorical data analysis, here highlights the most common level of interaction—a key insight for content creators aiming to maximize engagement.

In this chapter, we delve into the statistical examination of retweets within the realm of social media analytics, particularly focusing on a dataset from the fast fashion industry, referred to as `fast_fashion_nrc`. This dataset offers a fertile ground for understanding the dynamics of user engagement through retweets, a key metric in social media's virality and spread of content. Through R programming language, we explore various statistical measures that shed light on the distribution, variability, and overall patterns of retweets.

### Calculating the Range of Retweets

To gauge the spread of retweets across posts, we calculate the range, which is the difference between the maximum and minimum values of retweets:

```r
retweets_range <- fast_fashion_nrc %>%
  summarise(Range = max(Retweets_Count, na.rm = TRUE) - min(Retweets_Count, na.rm = TRUE))

retweets_range
```

Output:
```
Range
<int>
2318
```

This computation, `max(Retweets_Count, na.rm = TRUE) - min(Retweets_Count, na.rm = TRUE)`, signifies the extent of variability within the retweets count, ignoring any missing data (`na.rm = TRUE`). A range of 2318 indicates a substantial disparity between the most and least shared posts. While informative on variability, the range does not account for the distribution between these extremes.

### Standard Deviation of Retweets

To further understand the variability, we calculate the standard deviation, which measures the average distance of each data point from the mean:

```r
sd_retweets <- fast_fashion_nrc %>%
  summarise(sd = sd(Retweets_Count, na.rm = TRUE))

sd_retweets
```

Output:
```
sd
<dbl>
61.19467
```

The function `sd(Retweets_Count, na.rm = TRUE)` computes the standard deviation, with missing values omitted. A standard deviation of 61.19467 suggests retweets are, on average, spread out by about 61 units from the mean, providing insights into the distribution's dispersion around the mean retweet count.

### Summary Statistics

A comprehensive overview of retweets is given by the `summary()` function:

```r
summary(fast_fashion_nrc$Retweets_Count)
```

Output:
```
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max. 
   0.00    6.00   18.00   22.81   32.00 2318.00 
```

This output presents a snapshot of the dataset's distribution, including the minimum, first quartile, median, mean, third quartile, and maximum retweet counts. Notably, the median (18 retweets) differs from the mean (22.81 retweets), hinting at a skewed distribution. The quartiles further delineate the distribution, with 50% of the data falling between 6 and 32 retweets.

### Detailed Distribution Analysis with `skimr`

For a more detailed analysis, we employ the `skimr` package:

```r
library(skimr)

skim(fast_fashion_nrc$Retweets_Count)
```

Output:
```
skim_variable n_missing complete_rate mean     sd      p0  p25 p50 p75 p100    hist
1             data       0            1    22.80738 61.19467 0   6   18  32  2318    ▇▁▁▁▁
```

The `skim()` function provides a succinct summary, reaffirming the mean and standard deviation calculations, and illustrates the distribution of retweets through quartiles and a histogram. The histogram, represented as `▇▁▁▁▁`, visually indicates the concentration of data towards the lower end of the retweet count, with a long tail extending towards the maximum (2318 retweets).


In this section of the chapter, we explore the application of t-tests within the context of social media analytics for the fast fashion industry, using a dataset designated as `fast_fashion_nrc`. T-tests are statistical tests that compare the means of two groups to ascertain if they are significantly different from each other. They are particularly useful in social media analytics for comparing metrics such as sentiment scores, engagement rates, or any quantitative measure that could vary between two different conditions or groups.

### Dataset Segmentation by Brand

Initially, we segment our dataset into two subsets based on the brand associated with each social media post. This segmentation allows for focused comparisons between two prominent brands within the dataset, Gap and UNIQLO:

```r
# Split data sets
brand_gap <- fast_fashion_nrc %>% filter(brand == 'Gap')
brand_uniqlo <- fast_fashion_nrc %>% filter(brand == 'UNIQLO')
```

The `filter` function from the dplyr package is used to create two subsets of the data, `brand_gap` and `brand_uniqlo`, by isolating posts related to each brand.

### Independent Two-Sample t-test

We then conduct an independent two-sample t-test to compare the sentiment scores associated with Gap and UNIQLO's social media posts:

```r
t.test(brand_gap$sentiment_score, brand_uniqlo$sentiment_score)
```

Output:
```
	Welch Two Sample t-test

data:  brand_gap$sentiment_score and brand_uniqlo$sentiment_score
t = -19.097, df = 2532.2, p-value < 2.2e-16
alternative hypothesis: true difference in means is not equal to 0
95 percent confidence interval:
 -1.262395 -1.027293
sample estimates:
mean of x mean of y 
0.9840319 2.1288760 
```

The Welch Two Sample t-test, a variant of the t-test that does not assume equal variances between the two groups, indicates a significant difference in sentiment scores between Gap and UNIQLO posts. With a t-value of -19.097 and a practically zero p-value, we reject the null hypothesis that there is no difference in means, concluding a significant difference in sentiment scores. The negative t-value suggests that Gap's sentiment scores are lower on average than those of UNIQLO. The confidence interval further specifies the estimated range of the difference in means, reinforcing the significant disparity.

### Paired Sample t-test

Next, we apply a paired sample t-test to compare two related metrics within the same dataset, specifically retweets and replies counts for posts:

```r
paired_t_test_result <- t.test(fast_fashion_nrc$Retweets_Count, fast_fashion_nrc$Replies_Count, paired = TRUE)

paired_t_test_result
```

Output:
```
	Paired t-test

data:  fast_fashion_nrc$Retweets_Count and fast_fashion_nrc$Replies_Count
t = -49.27, df = 4635, p-value < 2.2e-16
alternative hypothesis: true mean difference is not equal to 0
95 percent confidence interval:
 -72.39551 -66.85470
sample estimates:
mean difference 
      -69.62511 
```

In the paired sample t-test, we assess whether the mean difference between each pair of observations (i.e., retweets and replies for the same post) is zero. The test yields a t-value of -49.27 and a p-value significantly less than 0.05, leading us to reject the null hypothesis and conclude a significant difference between the mean retweets and replies counts. The mean difference and its confidence interval suggest that, on average, there are significantly more replies than retweets per post, with the exact difference quantified in the output.

In this section, we delve into the use of Analysis of Variance (ANOVA) and linear regression models to analyze social media data from the fast fashion industry, as captured in the `fast_fashion_nrc` dataset. These statistical methods are crucial for examining the influence of various factors on social media metrics, such as sentiment scores and likes, and for understanding the relationships between different variables.

### One-Way ANOVA

First, we conduct a one-way ANOVA to investigate the impact of brand affiliation (Gap, H&M, UNIQLO, and ZARA) on the sentiment scores of social media posts:

```r
one_way_aov <- aov(sentiment_score ~ brand, data = fast_fashion_nrc)
summary(one_way_aov)
```

The ANOVA results indicate a significant effect of brand on sentiment scores, with a highly significant p-value (< 2.2e-16), suggesting that the mean sentiment scores differ across brands.

Following the ANOVA, we apply the Tukey's Honestly Significant Difference (HSD) test to pinpoint which specific brand comparisons are driving these differences:

```r
TukeyHSD(one_way_aov)
```

The Tukey HSD test reveals significant differences between all pairs of brands, indicating distinct perceptions and engagements across the brands. For instance, UNIQLO has a higher mean sentiment score compared to Gap, while ZARA's score is lower compared to UNIQLO, highlighting the nuanced brand sentiment landscape within the fast fashion industry.

### Two-Way ANOVA

Next, we expand our analysis to a two-way ANOVA to explore the combined effects of brand and image presence (categorized into 5 groups based on the image's characteristics) on the likes received by posts:

```r
two_way_aov <- aov(Likes_Count ~ brand * as.factor(Image.s.), data = fast_fashion_nrc)

summary(two_way_aov)
```

The two-way ANOVA results underscore significant main effects for both brand and image characteristics on likes count, as well as a significant interaction effect between these two factors. This suggests that the impact of brand on likes is not uniform across different image characteristics, indicating a complex interplay between content elements in driving social media engagement.

Tukey's HSD test for the brand factor:

```r
TukeyHSD(two_way_aov, which = "brand")
```

This test highlights specific brand comparisons that significantly affect likes counts, further delineating the influence of brand identity on social media performance.

### Simple Linear Regression

We also employ a simple linear regression model to examine the relationship between post length and retweets count:

```r
simple_lm <- lm(Retweets_Count ~ Post_Length, data = fast_fashion_nrc)
summary(simple_lm)
```

The regression output indicates no significant relationship between post length and retweets count (p-value: 0.998), suggesting that the length of a post does not predict the number of retweets it will receive.

### Multiple Linear Regression

Finally, a multiple linear regression model is fitted to explore the combined effects of post length, sentiment score, and post date on retweets count:

```r
multi_lm <- lm(Retweets_Count ~ Post_Length + sentiment_score + as.Date(Tweet_DateTime), data = fast_fashion_nrc)
summary(multi_lm)
```

This model reveals a significant negative relationship between sentiment score and retweets count, indicating that posts with lower sentiment scores tend to receive more retweets. The date of the post shows a marginally significant effect, hinting at temporal variations in retweet behavior.
