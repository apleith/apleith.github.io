<<<<<<< HEAD
# Sentiment Analysis Basics

## Introduction 

In the digital age, social media platforms have emerged as the town squares of the internet—a place where opinions are freely shared, and narratives are crafted and disseminated by individuals and brands alike. Amidst this vast expanse of digital conversation, sentiment analysis stands out as a critical tool, offering insights into the public's perceptions, emotions, and opinions. This chapter delves into the nuanced world of sentiment analysis within the context of social media analytics, guiding readers through the processes and methodologies that enable the transformation of raw social media data into meaningful sentiment insights.

The journey begins with an exploration of sentiment analysis—what it is, why it matters, and how it can be leveraged to glean insights from the cacophony of voices on social media platforms. We discuss the theoretical underpinnings of sentiment analysis, including the psychological and linguistic theories that inform our understanding of sentiment and emotion in text. From the technical perspective, we cover the spectrum of approaches to sentiment analysis, from rule-based methods leveraging sentiment lexicons to sophisticated machine learning algorithms that learn from large datasets.

Following the theoretical overview, the chapter transitions to practical applications, focusing on the fast fashion industry as a case study. We introduce the R programming language as a powerful tool for performing sentiment analysis, highlighting its rich ecosystem of packages designed for data manipulation, text mining, and visualization. Through a series of code examples, we demonstrate the process of cleaning and preprocessing tweet data, a necessary step to ensure the accuracy and reliability of sentiment analysis.

Key to our practical exploration is the use of the NRC Word-Emotion Association Lexicon, a resource that categorizes words into sentiment and emotion categories. We show how to customize this lexicon to suit specific analytical needs, such as excluding brand names that may skew analysis results. Our guide includes detailed instructions for mapping tweet content to lexicon entries, compiling sentiment scores, and normalizing these scores to facilitate comparative analysis across brands.

As we dive deeper into the analysis, we emphasize the importance of visualizing sentiment data to uncover trends and patterns. Using R's visualization capabilities, we illustrate how to create compelling graphics, including bar plots that compare sentiment scores across brands and radar charts that display the distribution of emotions for each brand. These visualizations serve as a lens through which we can observe the shifting sands of public sentiment over time.

Finally, we address the challenges and limitations of sentiment analysis, from the nuances of sarcasm and irony in text to the evolving nature of language on social media platforms. We conclude the chapter by reflecting on the future of sentiment analysis, considering advances in natural language processing and artificial intelligence that promise to enhance our ability to understand and interpret the emotions conveyed in text.

This chapter aims to equip readers with the knowledge and skills to conduct sentiment analysis on social media data, offering a window into the public's heart and mind. Whether you are a marketer seeking to gauge brand sentiment, a data scientist exploring the landscape of public opinion, or a student eager to learn about the intersection of technology and human emotion, this journey through sentiment analysis in social media analytics offers valuable insights and practical knowledge.

## Sentiment Analysis in the Fast Fashion Industry Using R

### Introduction to Required Libraries

To embark on sentiment analysis within the fast fashion industry, we must first set the stage with the right tools. This involves loading several R libraries, each serving a unique purpose in our data analysis journey.

```r
# Loading the required libraries
library(tidyverse)  # For data manipulation and visualization
library(tidytext)   # For text mining tasks
library(lubridate)  # For manipulating date-time data
library(textdata)   # To access the NRC sentiment lexicon
```

The `tidyverse` collection of packages offers a versatile suite for data manipulation and visualization, streamlining many routine data analysis tasks. `tidytext` provides specialized functions for text mining, a vital step in sentiment analysis. With `lubridate`, handling and interpreting date-time information becomes intuitive, enhancing our ability to analyze trends over time. Lastly, `textdata` grants us access to various lexicons and text datasets, such as the NRC Word-Emotion Association Lexicon, an essential resource for quantifying the sentiment conveyed by text.

### Data Ingestion

The analysis begins by sourcing tweet datasets corresponding to several key players in the fast fashion industry.

```r
# Reading in the data for each brand
gap <- read.csv("data/gap.csv")
hm <- read.csv("data/hm.csv")
uniqlo <- read.csv("data/uniqlo_uk.csv")
zara <- read.csv("data/zara.csv")
```

In this step, we read the tweet data for each brand from CSV files into R. Each dataset contains a wealth of information extracted from social media, serving as a rich source for sentiment analysis.

### Data Annotation

Once the datasets are loaded, we need to distinguish tweets from each brand within our unified analysis framework.

```r
# Annotating data with brand names
gap$brand <- "Gap"
hm$brand <- "H&M"
uniqlo$brand <- "UNIQLO"
zara$brand <- "ZARA"
```

Here, we append a new column to each brand's dataset, labeling the tweets accordingly. This annotation allows us to retain the brand identity even after merging the datasets, which is critical for brand-specific sentiment analysis.

### Data Merging {.unnumbered}

The final preparation step before analysis is to merge the datasets into a singular dataset.

```r
# Merging datasets into a single dataframe
fast_fashion <- bind_rows(gap, hm, uniqlo, zara)
```

Utilizing `bind_rows` from the `dplyr` package ensures that our data from multiple sources is combined seamlessly into one dataframe. This integrated data structure enables us to conduct comprehensive sentiment analysis across multiple brands simultaneously, comparing and contrasting the public perception of each brand in the fast fashion industry.

### Data Preprocessing {.unnumbered}

To extract meaningful insights from tweet data, it's imperative to clean and preprocess the text. This process involves removing extraneous content and standardizing the data format.

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

In this code snippet, the `mutate()` function from `dplyr` and various `str_replace_all()` functions from `stringr` are utilized to remove HTML entities, retweet and via texts, usernames, punctuation, numbers, URLs, and extra whitespace. The `str_trim()` function trims whitespace from the beginning and end of tweets, and `iconv()` converts the text encoding from UTF-8 to ASCII, replacing any non-ASCII characters with an empty string. These steps are crucial in creating a clean text corpus for analysis.

### Lexicon Acquisition

For sentiment analysis, we utilize the NRC Word-Emotion Association Lexicon, which associates words with sentiment and emotion categories.

```r
# Leveraging the NRC sentiment lexicon for analysis
nrc_lexicon <- get_sentiments("nrc") 
```

The `get_sentiments()` function retrieves the lexicon, providing a foundational dataset for identifying sentiments within the tweets. This lexicon will enable us to evaluate the emotional content of the tweets quantitatively.

### Sentiment Mapping

The following code breaks down tweet content into individual words and matches them with sentiment categories from the NRC lexicon.

```r
# Mapping tweet words to lexicon entries and analyzing sentiment
fast_fashion_sentiment <- fast_fashion %>%
  unnest_tokens(word, Tweet_Content) %>%
  inner_join(nrc_lexicon, by = "word")
```

`unnest_tokens()` tokenizes the tweets into individual words, and `inner_join()` merges these words with the NRC lexicon. This operation effectively tags each word with its associated sentiment(s), laying the groundwork for sentiment score computation.

### Sentiment Score Compilation

Finally, we compile sentiment scores for each brand by counting the number of occurrences of each sentiment and normalizing these counts.

```r
# Compiling sentiment scores by brand
sentiment_scores <- fast_fashion_sentiment %>%
  count(brand, sentiment) %>%
  spread(sentiment, n, fill = 0) %>%
  mutate(Total = rowSums(select(., where(is.numeric)))) %>%
  mutate(across(where(is.numeric), ~ . / Total)) %>%
  select(-Total)
```

Here, `count()` aggregates the number of each sentiment for each brand, and `spread()` reshapes the data, making it easier to analyze. The subsequent `mutate()` operations calculate the total sentiment counts and normalize the counts by the total. The final sentiment scores represent the relative frequency of each sentiment for each brand.

Through these stages, we transform raw tweet data into structured, quantifiable sentiment scores, enabling a nuanced understanding of brand sentiment within the fast fashion industry. These scores can then inform various marketing and branding strategies, providing valuable insights into public perception and consumer sentiment.

### Visualizing Overall Sentiment by Brand

Visualizing data is crucial for interpreting the results of sentiment analysis effectively. One method is to compare the overall sentiment for different brands. Here we utilize a bar plot to display the positive and negative sentiment scores side-by-side for each brand.

```r
# Visualizing positive and negative sentiment scores by brand
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

In this code, `ggplot` creates a bar plot where each brand's positive sentiment scores are represented above the x-axis, and negative scores are mirrored below. This mirrored bar plot provides an immediate visual comparison, showcasing the balance of sentiment each brand receives on social media. By customizing the fill colors, we differentiate positive from negative sentiment, enabling an intuitive understanding of the data.

### Refining Sentiment Lexicons

Sentiment analysis often requires customization of lexicons to align with the context of the data. For instance, the word "gap" might be frequent in fashion-related tweets but not carry sentiment value. In such cases, we remove it from the lexicon:

```r
# Adjusting the sentiment lexicon to exclude specific words
nrc_lexicon <- get_sentiments("nrc") %>%
  filter(word != "gap")
```

By filtering out the word "gap" from the NRC lexicon, we prevent it from skewing our sentiment analysis results, thus refining the accuracy of our study.

### Sentiment Mapping and Score Compilation

Once we have a tailored lexicon, we can map the tweet words to the lexicon entries and compile the sentiment scores for each brand:

```r
# Mapping tweet content to the NRC sentiment lexicon
fast_fashion_sentiment <- fast_fashion %>%
  unnest_tokens(word, Tweet_Content) %>%
  inner_join(nrc_lexicon, by = "word")

# Compiling normalized sentiment scores by brand
sentiment_scores <- fast_fashion_sentiment %>%
  count(brand, sentiment) %>%
  spread(sentiment, n, fill = 0) %>%
  mutate(Total = rowSums(select(., where(is.numeric)))) %>%
  mutate(across(where(is.numeric), ~ . / Total)) %>%
  select(-Total)
```

This code segment is at the heart of sentiment analysis. The `unnest_tokens` function from the `tidytext` package tokenizes the tweets, breaking down the text into individual words. These words are then matched to the sentiment lexicon using `inner_join`. After joining, we count and spread the sentiments across different columns corresponding to each sentiment type, creating a wide format of data. The `mutate` and `across` functions are then used to normalize these counts by dividing each sentiment count by the total count of sentiments, giving us a proportion of each sentiment for every brand.

Normalization is essential as it allows us to compare sentiment distributions across brands regardless of the number of tweets per brand, ensuring a level comparison field. The resulting `sentiment_scores` dataframe provides a brand-wise sentiment summary, ready for further analysis and visualization.

### Visualizing the Distribution of Emotions by Brand

The distribution of various emotions across brands can be visualized using a bar plot, which allows for comparison of the prominence of different emotions in the social media presence of each brand.

```r
# Transforming sentiment scores for visualization
emotion_scores_long <- sentiment_scores %>%
  select(brand, anger, anticipation, disgust, fear, joy, sadness, surprise, trust) %>%
  pivot_longer(cols = -brand, names_to = "emotion", values_to = "score")
```

In this transformation, `pivot_longer` reshapes the data from wide to long format. Each row now corresponds to a single emotion score for a brand, making it suitable for plotting.

```r
# Creating a bar plot for emotion distribution by brand
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

This `ggplot` bar plot visualizes the score of each emotion by brand, with the emotions on the y-axis and their corresponding scores on the x-axis. The use of `coord_flip()` swaps the axes, making the chart more readable, especially when dealing with long emotion labels. The `scale_fill_brewer` function applies a color palette that helps distinguish between brands visually.

This visualization uncovers which emotions are most frequently associated with each brand, providing valuable insights into public sentiment that can inform marketing strategies and brand management.

### Introduction to Radar Chart Visualization

Radar charts, also known as spider or web charts, offer a compelling way to display multivariate data in the form of a two-dimensional chart of three or more quantitative variables. They are particularly useful for visualizing performance analysis or survey data and, in our context, the distribution of sentiment across different emotional dimensions for brands in the fast fashion industry.

### Preparing Data for Radar Charts

For a radar chart, data must be normalized to ensure each variable contributes equally to the final plot. Normalization scales the variables to a range of [0, 1], allowing for a fair comparison across different emotions.

```r
library(fmsb)
library(scales)

# Normalize the data for radar chart which requires data to be in [0,1] for all variables
normalize_sentiments <- function(scores) {
  return((scores - min(scores, na.rm = TRUE)) / (max(scores, na.rm = TRUE) - min(scores, na.rm = TRUE)))
}

sentiment_scores_norm <- as.data.frame(lapply(sentiment_scores[, -1], normalize_sentiments))
sentiment_scores_norm$brand <- sentiment_scores$brand  # Add the brand column back
```

In this code segment, the `normalize_sentiments` function is defined to rescale sentiment scores. We then apply this function to each sentiment score column within our `sentiment_scores` data frame, excluding the `brand` column, and reattach the `brand` column afterward.

### Customizing Radar Chart Appearance {.unnumbered}

Next, we define the aesthetics for the radar charts by setting the fill colors with transparency and the line colors for each brand.

```r
# Define fill and line colors with transparency for visual distinction
colors_fill <- c(alpha("#fabed4", 0.3),
                 alpha("#ffd8b1", 0.3),
                 alpha("#aaffc3", 0.3),
                 alpha("#dcbeff", 0.3))

colors_line <- c("#fabed4", "#ffd8b1", "#aaffc3", "#dcbeff")
```

The `alpha()` function from the `scales` package adds transparency to the fill colors, enhancing the visual overlay of the radar charts. The `colors_fill` vector specifies the fill colors with adjusted alpha for transparency, while `colors_line` contains corresponding opaque colors for the outlines of each radar chart.

### Constructing Radar Charts {.unnumbered}

The primary function to create radar charts for each brand is `create_radar_chart`. It extracts the data for a given brand, adds necessary columns for plotting, and then plots the radar chart using the `radarchart` function from the `fmsb` package.

```r
# Function to generate radar charts for each brand
create_radar_chart <- function(brand_name, colors_fill, colors_line) {
  brand_data <- sentiment_scores_norm[sentiment_scores_norm$brand == brand_name, ]
  
  # Add columns for the maximum and minimum values required by radarchart
  brand_data <- rbind(rep(1, ncol(brand_data) - 1),  # Max values row, assuming normalized data
                      rep(0, ncol(brand_data) - 1),  # Min values row
                      brand_data[-1])               # Data without the brand column
  
  # Creating the radar chart
  radarchart(brand_data, 
             axistype = 1,
             seg = 5,
             pcol = colors_line[brands == brand_name], 
             pfcol = colors_fill[brands == brand_name],
             plwd = 2,
             cglcol = "#cccccc", 
             cglty = 1,
             axislabcol = "#cccccc",
             caxislabels = seq(0, 1, 0.2),
             cglwd = 0.8,
             vlcex = 0.8) +
  ggtitle(paste(brand_name, "Sentiment Analysis"))
}
```

This function takes the brand name and color settings as arguments, prepares the brand-specific data for the radar chart, and draws the chart. It also sets the number of axis segments (`seg`), customizes the line colors (`pcol`), the fill colors (`pfcol`), and other stylistic elements of the grid lines and labels. The title of each chart is set to include the brand name, making it clear which brand's sentiment analysis is being visualized.

### Displaying Radar Charts for All Brands {.unnumbered}

To visualize the sentiment distributions for all brands in our dataset, we iterate through the list of unique brands, applying the `create_radar_chart` function to each.

```r
brands <- unique(sentiment_scores_norm$brand)

# Configure the plotting area to display multiple charts
par(mfrow = c(2, 2))  # Set up a 2x2 grid layout

# Loop through the brands and create a radar chart for each
for (brand in brands) {
  create_radar_chart(brand, colors_fill, colors_line)
}

# Reset graphics parameters to default
par(mfrow = c(1, 1))
```

In the loop, we call `create_radar_chart` for each brand, which will create and plot a radar chart on a 2x2 grid layout. The `par(mfrow = c(2, 2))` function call configures the plotting area to accommodate four charts (one for each brand). After plotting, `par(mfrow = c(1, 1))` is used to reset the plotting area to default.

The resulting visualizations provide a multi-faceted view of the sentiment profiles for the different brands, facilitating comparative analysis and deeper insights into brand perception in the social media landscape.

Through the normalization process and careful visualization design, this chapter illustrates how radar charts can be an effective tool for displaying complex sentiment data in an accessible and visually appealing format.


### Cleaning and Preprocessing Social Media Data {.unnumbered}

The first step in analyzing social media data involves cleaning and preprocessing the text to remove noise and standardize the format for analysis.

```r
library(dplyr)
library(stringr)

fast_fashion <- fast_fashion %>%
  mutate(Tweet_Content = str_replace_all(Tweet_Content, "&amp", "") %>%
           str_replace_all("(RT|via)((?:\\b\\W*@\\w+)+)", "") %>%
           str_replace_all("@\\w+", "") %>%
           str_replace_all("[[:punct:]]", "") %>%
           str_replace_all("[[:digit:]]", "") %>%
           str_replace_all("http\\w+", "") %>%
           str_replace_all("[ \t]{2,}", " ") %>%
           str_trim() %>%
           iconv(., "UTF-8", "ASCII", sub=""))
```

In this section, we demonstrate how to use a combination of `str_replace_all` and `iconv` functions to remove unwanted characters and whitespace from the tweets. These steps include stripping HTML entities, retweets, mentions, punctuation, numbers, and hyperlinks. Such cleaning is vital for accurate sentiment analysis, as it focuses on the relevant text content.

### Custom Sentiment Analysis {.unnumbered}

Customizing sentiment analysis to the context of the data often yields more accurate results. For instance, a brand name may not carry intrinsic sentiment and should be excluded from the analysis.

```r
library(tidytext)
library(syuzhet)
library(dplyr)

# Remove the word "Gap" from the Tweet_Content column before performing sentiment analysis
fast_fashion$Tweet_Content <- gsub("\\bGap\\b", "", fast_fashion$Tweet_Content, ignore.case = TRUE)

# Assuming get_nrc_sentiment() is your custom or a specific package function that requires a character vector
emotions_rm_vr <- get_nrc_sentiment(fast_fashion$Tweet_Content)

# Aggregate sentiment scores
emo_sum_rm_vr <- colSums(emotions_rm_vr[, -1])  # Assuming the first column is not a sentiment score (e.g., tweet ID or text)
emo_sum_df <- data.frame(emotion = names(emo_sum_rm_vr), count = emo_sum_rm_vr) %>%
  arrange(desc(count))
```

The script above details how to prepare tweet content for sentiment analysis by removing the brand name "Gap" and executing a custom function `get_nrc_sentiment` to retrieve sentiment scores for the remaining text.

### Combining Sentiment Data with Original Data {.unnumbered}

After obtaining sentiment scores, we combine them with the original data to maintain context and facilitate further analysis.

```r
fast_fashion_nrc <- cbind(fast_fashion, emotions_rm_vr)
```

This simple `cbind` operation attaches the sentiment data directly to the original `fast_fashion` dataset, preserving all original information for subsequent steps.

### Calculating Sentiment Scores {.unnumbered}

Sentiment scores can be computed as the difference between positive and negative sentiment counts to understand the overall sentiment polarity of the tweets.

```r
fast_fashion_nrc <- fast_fashion_nrc %>%
  mutate(sentiment_score = positive - negative)
```

The above mutation creates a new `sentiment_score` variable, providing a single, continuous measure of sentiment for each tweet, ranging from negative to positive.

### Time Series Analysis of Sentiment Scores {.unnumbered}

Time series analysis is a powerful tool for uncovering trends over time. In this case, we're interested in understanding how sentiment towards each brand evolves daily.

```r
library(lubridate)

# Ensure Tweet_DateTime is in Date format
fast_fashion_daily <- fast_fashion_nrc %>%
  mutate(Tweet_Date = as.Date(Tweet_DateTime)) %>%
  group_by(brand, Tweet_Date) %>%
  summarise(daily_sentiment_score = mean(sentiment_score), .groups = 'drop')
```

The `lubridate` package is used to ensure the date information is properly formatted, enabling grouping and summarization of sentiment scores by day and brand.

### Visualizing Trends in Sentiment Scores {.unnumbered}

The final visualization step involves creating a scatter plot overlaid with a regression line, highlighting trends in sentiment scores over time.

```r
library(ggplot2)

ggplot(fast_fashion_daily, aes(x = Tweet_Date, y = daily_sentiment_score, color = brand)) +
  geom_point() +  # Scatter points
  geom_smooth(method = "lm", se = TRUE) +  # Overlay linear regression line, se = TRUE includes the confidence interval shading
  scale_color_brewer(palette = "Set1") +
  labs(title = "Daily Sentiment Score by Brand Over Time",
       x = "Date",
       y = "Average Daily Sentiment Score",
       color = "Brand") +
 

 theme_minimal() +
  theme(legend.title = element_blank())
```

This plot, created with `ggplot2`, displays scatter points representing daily average sentiment scores, with a regression line indicating the trend. The use of color distinguishes the brands, and the inclusion of a confidence interval around the regression line provides a visual indication of the reliability of the trend estimate.

Through these stages, students learn the comprehensive process of sentiment analysis from raw social media data to insightful visualizations, demonstrating the power of R for data-driven decision-making in marketing and brand management.
=======
# Sentiment Analysis Basics

## Introduction 

In the digital age, social media platforms have emerged as the town squares of the internet—a place where opinions are freely shared, and narratives are crafted and disseminated by individuals and brands alike. Amidst this vast expanse of digital conversation, sentiment analysis stands out as a critical tool, offering insights into the public's perceptions, emotions, and opinions. This chapter delves into the nuanced world of sentiment analysis within the context of social media analytics, guiding readers through the processes and methodologies that enable the transformation of raw social media data into meaningful sentiment insights.

The journey begins with an exploration of sentiment analysis—what it is, why it matters, and how it can be leveraged to glean insights from the cacophony of voices on social media platforms. We discuss the theoretical underpinnings of sentiment analysis, including the psychological and linguistic theories that inform our understanding of sentiment and emotion in text. From the technical perspective, we cover the spectrum of approaches to sentiment analysis, from rule-based methods leveraging sentiment lexicons to sophisticated machine learning algorithms that learn from large datasets.

Following the theoretical overview, the chapter transitions to practical applications, focusing on the fast fashion industry as a case study. We introduce the R programming language as a powerful tool for performing sentiment analysis, highlighting its rich ecosystem of packages designed for data manipulation, text mining, and visualization. Through a series of code examples, we demonstrate the process of cleaning and preprocessing tweet data, a necessary step to ensure the accuracy and reliability of sentiment analysis.

Key to our practical exploration is the use of the NRC Word-Emotion Association Lexicon, a resource that categorizes words into sentiment and emotion categories. We show how to customize this lexicon to suit specific analytical needs, such as excluding brand names that may skew analysis results. Our guide includes detailed instructions for mapping tweet content to lexicon entries, compiling sentiment scores, and normalizing these scores to facilitate comparative analysis across brands.

As we dive deeper into the analysis, we emphasize the importance of visualizing sentiment data to uncover trends and patterns. Using R's visualization capabilities, we illustrate how to create compelling graphics, including bar plots that compare sentiment scores across brands and radar charts that display the distribution of emotions for each brand. These visualizations serve as a lens through which we can observe the shifting sands of public sentiment over time.

Finally, we address the challenges and limitations of sentiment analysis, from the nuances of sarcasm and irony in text to the evolving nature of language on social media platforms. We conclude the chapter by reflecting on the future of sentiment analysis, considering advances in natural language processing and artificial intelligence that promise to enhance our ability to understand and interpret the emotions conveyed in text.

This chapter aims to equip readers with the knowledge and skills to conduct sentiment analysis on social media data, offering a window into the public's heart and mind. Whether you are a marketer seeking to gauge brand sentiment, a data scientist exploring the landscape of public opinion, or a student eager to learn about the intersection of technology and human emotion, this journey through sentiment analysis in social media analytics offers valuable insights and practical knowledge.

## Sentiment Analysis in the Fast Fashion Industry Using R

### Introduction to Required Libraries

To embark on sentiment analysis within the fast fashion industry, we must first set the stage with the right tools. This involves loading several R libraries, each serving a unique purpose in our data analysis journey.

```r
# Loading the required libraries
library(tidyverse)  # For data manipulation and visualization
library(tidytext)   # For text mining tasks
library(lubridate)  # For manipulating date-time data
library(textdata)   # To access the NRC sentiment lexicon
```

The `tidyverse` collection of packages offers a versatile suite for data manipulation and visualization, streamlining many routine data analysis tasks. `tidytext` provides specialized functions for text mining, a vital step in sentiment analysis. With `lubridate`, handling and interpreting date-time information becomes intuitive, enhancing our ability to analyze trends over time. Lastly, `textdata` grants us access to various lexicons and text datasets, such as the NRC Word-Emotion Association Lexicon, an essential resource for quantifying the sentiment conveyed by text.

### Data Ingestion

The analysis begins by sourcing tweet datasets corresponding to several key players in the fast fashion industry.

```r
# Reading in the data for each brand
gap <- read.csv("data/gap.csv")
hm <- read.csv("data/hm.csv")
uniqlo <- read.csv("data/uniqlo_uk.csv")
zara <- read.csv("data/zara.csv")
```

In this step, we read the tweet data for each brand from CSV files into R. Each dataset contains a wealth of information extracted from social media, serving as a rich source for sentiment analysis.

### Data Annotation

Once the datasets are loaded, we need to distinguish tweets from each brand within our unified analysis framework.

```r
# Annotating data with brand names
gap$brand <- "Gap"
hm$brand <- "H&M"
uniqlo$brand <- "UNIQLO"
zara$brand <- "ZARA"
```

Here, we append a new column to each brand's dataset, labeling the tweets accordingly. This annotation allows us to retain the brand identity even after merging the datasets, which is critical for brand-specific sentiment analysis.

### Data Merging {.unnumbered}

The final preparation step before analysis is to merge the datasets into a singular dataset.

```r
# Merging datasets into a single dataframe
fast_fashion <- bind_rows(gap, hm, uniqlo, zara)
```

Utilizing `bind_rows` from the `dplyr` package ensures that our data from multiple sources is combined seamlessly into one dataframe. This integrated data structure enables us to conduct comprehensive sentiment analysis across multiple brands simultaneously, comparing and contrasting the public perception of each brand in the fast fashion industry.

### Data Preprocessing {.unnumbered}

To extract meaningful insights from tweet data, it's imperative to clean and preprocess the text. This process involves removing extraneous content and standardizing the data format.

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

In this code snippet, the `mutate()` function from `dplyr` and various `str_replace_all()` functions from `stringr` are utilized to remove HTML entities, retweet and via texts, usernames, punctuation, numbers, URLs, and extra whitespace. The `str_trim()` function trims whitespace from the beginning and end of tweets, and `iconv()` converts the text encoding from UTF-8 to ASCII, replacing any non-ASCII characters with an empty string. These steps are crucial in creating a clean text corpus for analysis.

### Lexicon Acquisition

For sentiment analysis, we utilize the NRC Word-Emotion Association Lexicon, which associates words with sentiment and emotion categories.

```r
# Leveraging the NRC sentiment lexicon for analysis
nrc_lexicon <- get_sentiments("nrc") 
```

The `get_sentiments()` function retrieves the lexicon, providing a foundational dataset for identifying sentiments within the tweets. This lexicon will enable us to evaluate the emotional content of the tweets quantitatively.

### Sentiment Mapping

The following code breaks down tweet content into individual words and matches them with sentiment categories from the NRC lexicon.

```r
# Mapping tweet words to lexicon entries and analyzing sentiment
fast_fashion_sentiment <- fast_fashion %>%
  unnest_tokens(word, Tweet_Content) %>%
  inner_join(nrc_lexicon, by = "word")
```

`unnest_tokens()` tokenizes the tweets into individual words, and `inner_join()` merges these words with the NRC lexicon. This operation effectively tags each word with its associated sentiment(s), laying the groundwork for sentiment score computation.

### Sentiment Score Compilation

Finally, we compile sentiment scores for each brand by counting the number of occurrences of each sentiment and normalizing these counts.

```r
# Compiling sentiment scores by brand
sentiment_scores <- fast_fashion_sentiment %>%
  count(brand, sentiment) %>%
  spread(sentiment, n, fill = 0) %>%
  mutate(Total = rowSums(select(., where(is.numeric)))) %>%
  mutate(across(where(is.numeric), ~ . / Total)) %>%
  select(-Total)
```

Here, `count()` aggregates the number of each sentiment for each brand, and `spread()` reshapes the data, making it easier to analyze. The subsequent `mutate()` operations calculate the total sentiment counts and normalize the counts by the total. The final sentiment scores represent the relative frequency of each sentiment for each brand.

Through these stages, we transform raw tweet data into structured, quantifiable sentiment scores, enabling a nuanced understanding of brand sentiment within the fast fashion industry. These scores can then inform various marketing and branding strategies, providing valuable insights into public perception and consumer sentiment.

### Visualizing Overall Sentiment by Brand

Visualizing data is crucial for interpreting the results of sentiment analysis effectively. One method is to compare the overall sentiment for different brands. Here we utilize a bar plot to display the positive and negative sentiment scores side-by-side for each brand.

```r
# Visualizing positive and negative sentiment scores by brand
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

In this code, `ggplot` creates a bar plot where each brand's positive sentiment scores are represented above the x-axis, and negative scores are mirrored below. This mirrored bar plot provides an immediate visual comparison, showcasing the balance of sentiment each brand receives on social media. By customizing the fill colors, we differentiate positive from negative sentiment, enabling an intuitive understanding of the data.

### Refining Sentiment Lexicons

Sentiment analysis often requires customization of lexicons to align with the context of the data. For instance, the word "gap" might be frequent in fashion-related tweets but not carry sentiment value. In such cases, we remove it from the lexicon:

```r
# Adjusting the sentiment lexicon to exclude specific words
nrc_lexicon <- get_sentiments("nrc") %>%
  filter(word != "gap")
```

By filtering out the word "gap" from the NRC lexicon, we prevent it from skewing our sentiment analysis results, thus refining the accuracy of our study.

### Sentiment Mapping and Score Compilation

Once we have a tailored lexicon, we can map the tweet words to the lexicon entries and compile the sentiment scores for each brand:

```r
# Mapping tweet content to the NRC sentiment lexicon
fast_fashion_sentiment <- fast_fashion %>%
  unnest_tokens(word, Tweet_Content) %>%
  inner_join(nrc_lexicon, by = "word")

# Compiling normalized sentiment scores by brand
sentiment_scores <- fast_fashion_sentiment %>%
  count(brand, sentiment) %>%
  spread(sentiment, n, fill = 0) %>%
  mutate(Total = rowSums(select(., where(is.numeric)))) %>%
  mutate(across(where(is.numeric), ~ . / Total)) %>%
  select(-Total)
```

This code segment is at the heart of sentiment analysis. The `unnest_tokens` function from the `tidytext` package tokenizes the tweets, breaking down the text into individual words. These words are then matched to the sentiment lexicon using `inner_join`. After joining, we count and spread the sentiments across different columns corresponding to each sentiment type, creating a wide format of data. The `mutate` and `across` functions are then used to normalize these counts by dividing each sentiment count by the total count of sentiments, giving us a proportion of each sentiment for every brand.

Normalization is essential as it allows us to compare sentiment distributions across brands regardless of the number of tweets per brand, ensuring a level comparison field. The resulting `sentiment_scores` dataframe provides a brand-wise sentiment summary, ready for further analysis and visualization.

### Visualizing the Distribution of Emotions by Brand

The distribution of various emotions across brands can be visualized using a bar plot, which allows for comparison of the prominence of different emotions in the social media presence of each brand.

```r
# Transforming sentiment scores for visualization
emotion_scores_long <- sentiment_scores %>%
  select(brand, anger, anticipation, disgust, fear, joy, sadness, surprise, trust) %>%
  pivot_longer(cols = -brand, names_to = "emotion", values_to = "score")
```

In this transformation, `pivot_longer` reshapes the data from wide to long format. Each row now corresponds to a single emotion score for a brand, making it suitable for plotting.

```r
# Creating a bar plot for emotion distribution by brand
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

This `ggplot` bar plot visualizes the score of each emotion by brand, with the emotions on the y-axis and their corresponding scores on the x-axis. The use of `coord_flip()` swaps the axes, making the chart more readable, especially when dealing with long emotion labels. The `scale_fill_brewer` function applies a color palette that helps distinguish between brands visually.

This visualization uncovers which emotions are most frequently associated with each brand, providing valuable insights into public sentiment that can inform marketing strategies and brand management.

### Introduction to Radar Chart Visualization

Radar charts, also known as spider or web charts, offer a compelling way to display multivariate data in the form of a two-dimensional chart of three or more quantitative variables. They are particularly useful for visualizing performance analysis or survey data and, in our context, the distribution of sentiment across different emotional dimensions for brands in the fast fashion industry.

### Preparing Data for Radar Charts

For a radar chart, data must be normalized to ensure each variable contributes equally to the final plot. Normalization scales the variables to a range of [0, 1], allowing for a fair comparison across different emotions.

```r
library(fmsb)
library(scales)

# Normalize the data for radar chart which requires data to be in [0,1] for all variables
normalize_sentiments <- function(scores) {
  return((scores - min(scores, na.rm = TRUE)) / (max(scores, na.rm = TRUE) - min(scores, na.rm = TRUE)))
}

sentiment_scores_norm <- as.data.frame(lapply(sentiment_scores[, -1], normalize_sentiments))
sentiment_scores_norm$brand <- sentiment_scores$brand  # Add the brand column back
```

In this code segment, the `normalize_sentiments` function is defined to rescale sentiment scores. We then apply this function to each sentiment score column within our `sentiment_scores` data frame, excluding the `brand` column, and reattach the `brand` column afterward.

### Customizing Radar Chart Appearance {.unnumbered}

Next, we define the aesthetics for the radar charts by setting the fill colors with transparency and the line colors for each brand.

```r
# Define fill and line colors with transparency for visual distinction
colors_fill <- c(alpha("#fabed4", 0.3),
                 alpha("#ffd8b1", 0.3),
                 alpha("#aaffc3", 0.3),
                 alpha("#dcbeff", 0.3))

colors_line <- c("#fabed4", "#ffd8b1", "#aaffc3", "#dcbeff")
```

The `alpha()` function from the `scales` package adds transparency to the fill colors, enhancing the visual overlay of the radar charts. The `colors_fill` vector specifies the fill colors with adjusted alpha for transparency, while `colors_line` contains corresponding opaque colors for the outlines of each radar chart.

### Constructing Radar Charts {.unnumbered}

The primary function to create radar charts for each brand is `create_radar_chart`. It extracts the data for a given brand, adds necessary columns for plotting, and then plots the radar chart using the `radarchart` function from the `fmsb` package.

```r
# Function to generate radar charts for each brand
create_radar_chart <- function(brand_name, colors_fill, colors_line) {
  brand_data <- sentiment_scores_norm[sentiment_scores_norm$brand == brand_name, ]
  
  # Add columns for the maximum and minimum values required by radarchart
  brand_data <- rbind(rep(1, ncol(brand_data) - 1),  # Max values row, assuming normalized data
                      rep(0, ncol(brand_data) - 1),  # Min values row
                      brand_data[-1])               # Data without the brand column
  
  # Creating the radar chart
  radarchart(brand_data, 
             axistype = 1,
             seg = 5,
             pcol = colors_line[brands == brand_name], 
             pfcol = colors_fill[brands == brand_name],
             plwd = 2,
             cglcol = "#cccccc", 
             cglty = 1,
             axislabcol = "#cccccc",
             caxislabels = seq(0, 1, 0.2),
             cglwd = 0.8,
             vlcex = 0.8) +
  ggtitle(paste(brand_name, "Sentiment Analysis"))
}
```

This function takes the brand name and color settings as arguments, prepares the brand-specific data for the radar chart, and draws the chart. It also sets the number of axis segments (`seg`), customizes the line colors (`pcol`), the fill colors (`pfcol`), and other stylistic elements of the grid lines and labels. The title of each chart is set to include the brand name, making it clear which brand's sentiment analysis is being visualized.

### Displaying Radar Charts for All Brands {.unnumbered}

To visualize the sentiment distributions for all brands in our dataset, we iterate through the list of unique brands, applying the `create_radar_chart` function to each.

```r
brands <- unique(sentiment_scores_norm$brand)

# Configure the plotting area to display multiple charts
par(mfrow = c(2, 2))  # Set up a 2x2 grid layout

# Loop through the brands and create a radar chart for each
for (brand in brands) {
  create_radar_chart(brand, colors_fill, colors_line)
}

# Reset graphics parameters to default
par(mfrow = c(1, 1))
```

In the loop, we call `create_radar_chart` for each brand, which will create and plot a radar chart on a 2x2 grid layout. The `par(mfrow = c(2, 2))` function call configures the plotting area to accommodate four charts (one for each brand). After plotting, `par(mfrow = c(1, 1))` is used to reset the plotting area to default.

The resulting visualizations provide a multi-faceted view of the sentiment profiles for the different brands, facilitating comparative analysis and deeper insights into brand perception in the social media landscape.

Through the normalization process and careful visualization design, this chapter illustrates how radar charts can be an effective tool for displaying complex sentiment data in an accessible and visually appealing format.


### Cleaning and Preprocessing Social Media Data {.unnumbered}

The first step in analyzing social media data involves cleaning and preprocessing the text to remove noise and standardize the format for analysis.

```r
library(dplyr)
library(stringr)

fast_fashion <- fast_fashion %>%
  mutate(Tweet_Content = str_replace_all(Tweet_Content, "&amp", "") %>%
           str_replace_all("(RT|via)((?:\\b\\W*@\\w+)+)", "") %>%
           str_replace_all("@\\w+", "") %>%
           str_replace_all("[[:punct:]]", "") %>%
           str_replace_all("[[:digit:]]", "") %>%
           str_replace_all("http\\w+", "") %>%
           str_replace_all("[ \t]{2,}", " ") %>%
           str_trim() %>%
           iconv(., "UTF-8", "ASCII", sub=""))
```

In this section, we demonstrate how to use a combination of `str_replace_all` and `iconv` functions to remove unwanted characters and whitespace from the tweets. These steps include stripping HTML entities, retweets, mentions, punctuation, numbers, and hyperlinks. Such cleaning is vital for accurate sentiment analysis, as it focuses on the relevant text content.

### Custom Sentiment Analysis {.unnumbered}

Customizing sentiment analysis to the context of the data often yields more accurate results. For instance, a brand name may not carry intrinsic sentiment and should be excluded from the analysis.

```r
library(tidytext)
library(syuzhet)
library(dplyr)

# Remove the word "Gap" from the Tweet_Content column before performing sentiment analysis
fast_fashion$Tweet_Content <- gsub("\\bGap\\b", "", fast_fashion$Tweet_Content, ignore.case = TRUE)

# Assuming get_nrc_sentiment() is your custom or a specific package function that requires a character vector
emotions_rm_vr <- get_nrc_sentiment(fast_fashion$Tweet_Content)

# Aggregate sentiment scores
emo_sum_rm_vr <- colSums(emotions_rm_vr[, -1])  # Assuming the first column is not a sentiment score (e.g., tweet ID or text)
emo_sum_df <- data.frame(emotion = names(emo_sum_rm_vr), count = emo_sum_rm_vr) %>%
  arrange(desc(count))
```

The script above details how to prepare tweet content for sentiment analysis by removing the brand name "Gap" and executing a custom function `get_nrc_sentiment` to retrieve sentiment scores for the remaining text.

### Combining Sentiment Data with Original Data {.unnumbered}

After obtaining sentiment scores, we combine them with the original data to maintain context and facilitate further analysis.

```r
fast_fashion_nrc <- cbind(fast_fashion, emotions_rm_vr)
```

This simple `cbind` operation attaches the sentiment data directly to the original `fast_fashion` dataset, preserving all original information for subsequent steps.

### Calculating Sentiment Scores {.unnumbered}

Sentiment scores can be computed as the difference between positive and negative sentiment counts to understand the overall sentiment polarity of the tweets.

```r
fast_fashion_nrc <- fast_fashion_nrc %>%
  mutate(sentiment_score = positive - negative)
```

The above mutation creates a new `sentiment_score` variable, providing a single, continuous measure of sentiment for each tweet, ranging from negative to positive.

### Time Series Analysis of Sentiment Scores {.unnumbered}

Time series analysis is a powerful tool for uncovering trends over time. In this case, we're interested in understanding how sentiment towards each brand evolves daily.

```r
library(lubridate)

# Ensure Tweet_DateTime is in Date format
fast_fashion_daily <- fast_fashion_nrc %>%
  mutate(Tweet_Date = as.Date(Tweet_DateTime)) %>%
  group_by(brand, Tweet_Date) %>%
  summarise(daily_sentiment_score = mean(sentiment_score), .groups = 'drop')
```

The `lubridate` package is used to ensure the date information is properly formatted, enabling grouping and summarization of sentiment scores by day and brand.

### Visualizing Trends in Sentiment Scores {.unnumbered}

The final visualization step involves creating a scatter plot overlaid with a regression line, highlighting trends in sentiment scores over time.

```r
library(ggplot2)

ggplot(fast_fashion_daily, aes(x = Tweet_Date, y = daily_sentiment_score, color = brand)) +
  geom_point() +  # Scatter points
  geom_smooth(method = "lm", se = TRUE) +  # Overlay linear regression line, se = TRUE includes the confidence interval shading
  scale_color_brewer(palette = "Set1") +
  labs(title = "Daily Sentiment Score by Brand Over Time",
       x = "Date",
       y = "Average Daily Sentiment Score",
       color = "Brand") +
 

 theme_minimal() +
  theme(legend.title = element_blank())
```

This plot, created with `ggplot2`, displays scatter points representing daily average sentiment scores, with a regression line indicating the trend. The use of color distinguishes the brands, and the inclusion of a confidence interval around the regression line provides a visual indication of the reliability of the trend estimate.

Through these stages, students learn the comprehensive process of sentiment analysis from raw social media data to insightful visualizations, demonstrating the power of R for data-driven decision-making in marketing and brand management.
>>>>>>> e30406f42f4cd034c38de001e1c2497a20706935
