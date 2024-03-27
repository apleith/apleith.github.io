# Sentiment Analysis Basics

In this chapter, we delve into the practical application of R for social media analytics, with a focus on sentiment analysis. Utilizing tweets from leading fast fashion brands—Gap, H&M, UNIQLO, and ZARA—we demonstrate how to gather, cleanse, and analyze social media data to uncover public sentiment and emotional responses.

## Preliminary Setup

Initiating our analysis requires setting up the R environment with essential libraries for data manipulation, text mining, and date-time processing. Ensure these libraries are installed and loaded:


```r
# Install necessary libraries if not already installed
# install.packages(c("tidyverse", "tidytext", "lubridate", "textdata"))

# Loading the required libraries
library(tidyverse)  # For data manipulation and visualization
#> ── Attaching core tidyverse packages ──── tidyverse 2.0.0 ──
#> ✔ dplyr     1.1.3     ✔ readr     2.1.4
#> ✔ forcats   1.0.0     ✔ stringr   1.5.0
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

## Data Collection

Our journey begins by loading existing tweet data for each fashion brand. These datasets are assumed to be saved as CSV files.


```r
# Reading in the data for each brand
gap <- read.csv("data/gap.csv")
hm <- read.csv("data/hm.csv")
uniqlo <- read.csv("data/uniqlo_uk.csv")
zara <- read.csv("data/zara.csv")

# Annotating data with brand names
gap$brand <- "Gap"
hm$brand <- "H&M"
uniqlo$brand <- "UNIQLO"
zara$brand <- "ZARA"

# Merging datasets into a single dataframe
fast_fashion <- bind_rows(gap, hm, uniqlo, zara)
```

## Data Cleaning and Preprocessing

Accurate sentiment analysis requires that text data be cleaned and preprocessed. Here, we remove unnecessary characters and whitespace, standardize encoding, and prepare the text for analysis.


```r
# Streamlining the cleaning and preprocessing of tweet content
fast_fashion <- fast_fashion %>%
  mutate(Tweet_Content = str_replace_all(Tweet_Content, "&amp", "") %>%
           str_replace_all("(RT|via)((?:\\b\\W*@\\w+)+)", "") %>%
           str_replace_all("@\\w+", "") %>%
           str_replace_all("[[:punct:]]", "") %>%
           str_replace_all("[[:digit:]]", "") %>%
           str_replace_all("http\\w+", "") %>%
           str_replace_all("[ \t]{2,}", " ") %>%
           str_trim() %>%
           iconv("UTF-8", "ASCII", sub=""))
```

## Sentiment Analysis

We employ the NRC Word-Emotion Association Lexicon, a comprehensive resource for categorizing text by emotional content, to analyze and quantify the sentiment expressed in each tweet.


```r
# Leveraging the NRC sentiment lexicon for analysis
nrc_lexicon <- get_sentiments("nrc") 

# Mapping tweet words to lexicon entries and analyzing sentiment
fast_fashion_sentiment <- fast_fashion %>%
  unnest_tokens(word, Tweet_Content) %>%
  inner_join(nrc_lexicon, by = "word")
#> Warning in inner_join(., nrc_lexicon, by = "word"): Detected an unexpected many-to-many relationship between
#> `x` and `y`.
#> ℹ Row 12 of `x` matches multiple rows in `y`.
#> ℹ Row 5462 of `y` matches multiple rows in `x`.
#> ℹ If a many-to-many relationship is expected, set
#>   `relationship = "many-to-many"` to silence this warning.

# Compiling sentiment scores by brand
sentiment_scores <- fast_fashion_sentiment %>%
  count(brand, sentiment) %>%
  spread(sentiment, n, fill = 0) %>%
  mutate(Total = rowSums(select(., where(is.numeric)))) %>%
  mutate(across(where(is.numeric), ~ . / Total)) %>%
  select(-Total)
```

### Visualization of Sentiment Analysis Results

Visual representation of sentiment analysis outcomes facilitates a clearer understanding of public perception and emotional responses towards each brand.

#### Comparative Barplot for Positive and Negative Sentiments

A barplot contrasting positive and negative sentiments reveals the overall sentiment landscape for each brand.


```r
# Assuming `sentiment_scores` has columns `brand`, `positive`, and `negative`
ggplot(sentiment_scores, aes(x = brand)) +
  geom_bar(aes(y = positive, fill = "Positive"), stat = "identity") +
  geom_bar(aes(y = -negative, fill = "Negative"), stat = "identity") +
  scale_fill_manual(values = c("Positive" = "#5B84B1FF", "Negative" = "#FC766AFF")) +
  labs(title = "Comparative Sentiment Scores by Brand",
       y = "Sentiment Score",
       x = "Brand") +
  theme_minimal() +
  theme(legend.title = element_blank())
```

![](09-sentiment_files/figure-epub3/positive-negative-barplot-1.png)<!-- -->

#### Barplot for the Other Eight Emotions

Expanding our analysis, we examine the distribution of eight additional emotional responses across the brands.


```r
# Transforming sentiment scores for visualization
emotion_scores_long <- sentiment_scores %>%
  select(brand, anger, anticipation, disgust, fear, joy, sadness, surprise, trust) %>%
  pivot_longer(cols = -brand, names_to = "emotion", values_to = "score")

# Plotting emotion distribution by brand
ggplot(emotion_scores_long, aes(x = emotion, y = score, fill = brand)) +
  geom_bar(stat = "identity", position = "dodge") +
  scale_fill_brewer(palette = "Set3") +
  labs(title = "Emotion Distribution by Brand",
       x = "Emotion",
       y = "Score",
       fill = "Brand") +
  theme_minimal() +
  coord_flip()
```

![](09-sentiment_files/figure-epub3/emotions-barplot-1.png)<!-- -->

This textbook chapter provides a comprehensive introduction to social media analytics using R, focusing on sentiment analysis of tweets from fast fashion brands. Through this analysis, we gain insights into the public sentiment and emotional landscape surrounding these brands, demonstrating the power of text mining in shaping marketing strategies and brand management.
