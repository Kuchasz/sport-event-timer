# sport-event-timer

Application for making time measurements

## Ideas

| Added Date | Idea                                                                  |                  Status                   |
| ---------- | --------------------------------------------------------------------- | :---------------------------------------: |
| 07/09/2023 | Race must have at least 2 Timing Points                               | <sup>:heavy_check_mark:(12/09/2023)</sup> |
| 07/09/2023 | Tenant must have at least one Race                                    | <sup>:heavy_check_mark:(18/12/2023)</sup> |
| 07/09/2023 | Prevent Start Time and Bib Number duplication                         | <sup>:heavy_check_mark:(04/01/2024)</sup> |
| 07/09/2023 | Unify AccessUrl and ApiKey naming conventions                         | <sup>:heavy_check_mark:(07/09/2023)</sup> |
| 08/09/2023 | Solve issue of sync between Player and Player Registration            | <sup>:heavy_check_mark:(11/09/2023)</sup> |
| 10/09/2023 | Indeterminate state on save buttons                                   | <sup>:heavy_check_mark:(20/09/2023)</sup> |
| 11/09/2023 | Fallback for public routes triggered with invalid raceId              | <sup>:heavy_check_mark:(06/01/2024)</sup> |
| 13/09/2023 | Turn prisma seed into 'example race generation' button                | <sup>:heavy_check_mark:(13/09/2023)</sup> |
| 14/09/2023 | Allow example race customization                                      | <sup>:heavy_check_mark:(14/09/2023)</sup> |
| 14/09/2023 | Country names localization                                            | <sup>:heavy_check_mark:(14/09/2023)</sup> |
| 17/09/2023 | Fix grid reload on data changes <sup>(updated)</sup>                  | <sup>:heavy_check_mark:(18/09/2023)</sup> |
| 19/09/2023 | Support for laps on timing point                                      | <sup>:heavy_check_mark:(26/04/2024)</sup> |
| 19/09/2023 | Add notifications to successful/failed actions                        | <sup>:heavy_check_mark:(04/01/2024)</sup> |
| 25/09/2023 | Short name for Timing Points                                          | <sup>:heavy_check_mark:(25/09/2023)</sup> |
| 01/10/2023 | Speed up application build and release times                          | <sup>:heavy_check_mark:(03/10/2023)</sup> |
| 03/10/2023 | Start new race selection dashboard                                    | <sup>:heavy_check_mark:(17/10/2023)</sup> |
| 17/10/2023 | Sport discipline specification                                        | <sup>:heavy_check_mark:(24/10/2023)</sup> |
| 18/10/2023 | Missing split times interpolation                                     |                  :date:                   |
| 19/10/2023 | Fix many jumping stuff on home page                                   | <sup>:heavy_check_mark:(21/10/2023)</sup> |
| 20/10/2023 | Remove hard-coded application urls and ports                          | <sup>:heavy_check_mark:(29/10/2023)</sup> |
| 20/10/2023 | Dates should use locale formats (use intl formatter)                  |                  :date:                   |
| 20/10/2023 | Configure linter + CI/CD pipeline                                     | <sup>:heavy_check_mark:(23/10/2023)</sup> |
| 23/10/2023 | Simple website with registration, start list and results              |                  :date:                   |
| 23/10/2023 | Ability to turn on/off race website (and public catalog)              |                  :date:                   |
| 23/10/2023 | Ready to use scripts to inject on other websites                      |                  :date:                   |
| 23/10/2023 | Improve login page look                                               | <sup>:heavy_check_mark:(20/11/2023)</sup> |
| 26/10/2023 | Start list .CSV import/export                                         |                  :date:                   |
| 26/10/2023 | Add links to stopwatch and timer to the race panel                    | <sup>:heavy_check_mark:(29/10/2023)</sup> |
| 26/10/2023 | Timer for finish line                                                 |                  :date:                   |
| 26/10/2023 | Races list quick search                                               | <sup>:heavy_check_mark:(25/10/2023)</sup> |
| 26/10/2023 | Players list rework <sup>(with quick search)</sup>                    | <sup>:heavy_check_mark:(04/11/2023)</sup> |
| 26/10/2023 | QR Code to results list                                               | <sup>:heavy_check_mark:(30/10/2023)</sup> |
| 27/10/2023 | Penalties management in panel                                         | <sup>:heavy_check_mark:(27/11/2023)</sup> |
| 27/10/2023 | Stopwatches locking                                                   |                  :date:                   |
| 27/10/2023 | Panel language selector                                               |                  :date:                   |
| 27/10/2023 | DSQ support                                                           | <sup>:heavy_check_mark:(27/11/2023)</sup> |
| 27/10/2023 | Steps for race creation                                               |                  :date:                   |
| 27/10/2023 | Add stopwatch history to the race panel                               |                  :date:                   |
| 28/10/2023 | Replace onclick with mousedown in stopwatch <sup>(where needed)</sup> | <sup>:heavy_check_mark:(29/10/2023)</sup> |
| 29/10/2023 | Change race and split time forms to use new component                 | <sup>:heavy_check_mark:(29/10/2023)</sup> |
| 29/10/2023 | Fees configuration                                                    |                  :date:                   |
| 29/10/2023 | Localized example race data                                           | <sup>:heavy_check_mark:(30/10/2023)</sup> |
| 29/10/2023 | Refactor all useFormState<T> hook usages                              | <sup>:heavy_check_mark:(29/10/2023)</sup> |
| 30/10/2023 | Simple api links returning some daa (eg start list)                   |                  :date:                   |
| 04/11/2023 | Display classification name instead of just id                        | <sup>:heavy_check_mark:(04/11/2023)</sup> |
| 04/11/2023 | Add translation to Gender                                             | <sup>:heavy_check_mark:(05/11/2023)</sup> |
| 05/11/2023 | Add custom hideable scrollbar to side menu                            | <sup>:heavy_check_mark:(05/11/2023)</sup> |
| 06/11/2023 | Implement sort over columns to Data Table                             | <sup>:heavy_check_mark:(22/11/2023)</sup> |
| 06/11/2023 | Bib Numbers print mechanism                                           |                  :date:                   |
| 06/11/2023 | Printable start list                                                  |                  :date:                   |
| 06/11/2023 | Printable results                                                     |                  :date:                   |
| 06/11/2023 | Add participation cerfificates with printing                          |                  :date:                   |
| 06/11/2023 | Badge counters on certain menu items                                  | <sup>:heavy_check_mark:(06/11/2023)</sup> |
| 06/11/2023 | Special filters on Data Table <sup>(eg. for paid players)</sup>       |                  :date:                   |
| 07/11/2023 | Use Data Table on results                                             | <sup>:heavy_check_mark:(24/11/2023)</sup> |
| 09/11/2023 | Persist some grid settings in url                                     |                  :date:                   |
| 09/11/2023 | Animate chevron on switching to next player <sup>(start list)</sup>   | <sup>:heavy_check_mark:(13/11/2023)</sup> |
| 10/11/2023 | Enter to submit form                                                  | <sup>:heavy_check_mark:(13/11/2023)</sup> |
| 12/11/2023 | Ability to edit basic race info from race panel                       | <sup>:heavy_check_mark:(19/01/2024)</sup> |
| 13/11/2023 | Age Categories gaps and overlaping visualisation                      |                  :date:                   |
| 14/11/2023 | Replace NextAuth                                                      | <sup>:heavy_check_mark:(19/11/2023)</sup> |
| 21/11/2023 | Salt passwords                                                        | <sup>:heavy_check_mark:(22/11/2023)</sup> |
| 22/11/2023 | Support for sort over dates                                           |                  :date:                   |
| 22/11/2023 | Highlight search phrase in Data table results                         | <sup>:heavy_check_mark:(23/11/2023)</sup> |
| 23/11/2023 | Optional race registration expire time                                | <sup>:heavy_check_mark:(01/01/2024)</sup> |
| 24/11/2023 | Add no data message to Data Table                                     | <sup>:heavy_check_mark:(14/12/2023)</sup> |
| 25/11/2023 | Separate splits from timing points                                    |                  :date:                   |
| 27/11/2023 | Full page penalties view                                              | <sup>:heavy_check_mark:(15/12/2023)</sup> |
| 27/11/2023 | Fix nested dialogs/modals disappearing issue                          | <sup>:heavy_check_mark:(01/12/2023)</sup> |
| 27/11/2023 | Registration status on PlayerRegistrations page                       |                  :date:                   |
| 27/11/2023 | Improve public results loading time                                   | <sup>:heavy_check_mark:(27/11/2023)</sup> |
| 28/11/2023 | Rework confirmation popups                                            | <sup>:heavy_check_mark:(03/12/2023)</sup> |
| 29/11/2023 | API for timings upload                                                |                  :date:                   |
| 06/12/2023 | Omit ws connection when not needed                                    | <sup>:heavy_check_mark:(06/12/2023)</sup> |
| 06/12/2023 | Add next race stats to the home page                                  |                  :date:                   |
| 06/12/2023 | Configure runtime environment to run multiple threads                 |                  :date:                   |
| 06/12/2023 | Registration form confirmation message                                |                  :date:                   |
| 06/12/2023 | Universal requests error handling                                     | <sup>:heavy_check_mark:(13/12/2023)</sup> |
| 09/12/2023 | Fix server url in trpc session fetching                               |                  :date:                   |
| 12/12/2023 | Specify timezone for race                                             |                  :date:                   |
| 15/12/2023 | Templating engine for registration email message                      |                  :date:                   |
| 19/12/2023 | Terms document upload                                                 |                  :date:                   |
| 24/12/2023 | Separate APP and API to separate environments                         | <sup>:heavy_check_mark:(30/12/2023)</sup> |
| 29/12/2023 | StartTime, TimeResult and TimeSpans input mask                        | <sup>:heavy_check_mark:(18/01/2024)</sup> |
| 29/12/2023 | Alternative start intervals (15s, 30s, 2m, etc)                       |                  :date:                   |
| 01/01/2024 | Add change sets to home page                                          |                  :date:                   |
| 02/01/2024 | Fix toaster on home page                                              |                  :date:                   |
| 07/01/2024 | Clearly distinguish optional and required fields                      |                  :date:                   |
| 07/01/2024 | Verify if player is already registered                                |                  :date:                   |
| 07/01/2024 | Ability to turn on/off autostart                                      |                  :date:                   |
| 07/01/2024 | Stopwatch translations                                                |                  :date:                   |
| 07/01/2024 | Proper PWA manifests for all tools                                    |                  :date:                   |
| 07/01/2024 | Investigate and fix onmousedown issues in stopwatch                   | <sup>:heavy_check_mark:(13/01/2024)</sup> |
| 14/01/2024 | Keyboard support on stopwatch pad                                     |                  :date:                   |
| 17/01/2024 | Countdown change background on remaining time                         |                  :date:                   |
| 18/01/2024 | Master/details view on players page                                   |                  :date:                   |
| 18/01/2024 | Add longer, more self explanatory descriptions to page headers        |                  :date:                   |
| 20/01/2024 | Replace 'Race' word with 'Competition'                                |                  :date:                   |
| 22/01/2024 | Grid loading state                                                    |                  :date:                   |
| 23/01/2024 | Apply penalty/dsq reasons combobox                                    | <sup>:heavy_check_mark:(23/01/2024)</sup> |
| 27/01/2024 | Disable laps on start and finish                                      | <sup>:heavy_check_mark:(29/01/2024)</sup> |
| 29/01/2024 | Split time edit on flyout from the bottom                             |                  :date:                   |
| 02/02/2024 | Toast notification should be displayed on top of confirmationbackdrop |                  :date:                   |
| 04/02/2024 | Highlight new result on results page                                  |                  :date:                   |
| 04/02/2024 | Add split times (with laps) to results page                           |                  :date:                   |
| 04/02/2024 | Overall/categories toggle switch on results page                      |                  :date:                   |
| 05/02/2024 | Each classification may/should have separate timing points            |                  :date:                   |
| 05/02/2024 | Each classification should have separate route length, date and start |                  :date:                   |
| 05/02/2024 | Optional registration fields                                          |                  :date:                   |
| 07/02/2024 | Reduce middlewares bundle size                                        |                  :date:                   |
| 07/02/2024 | Improve results list rendering performance                            |                  :date:                   |
| 12/02/2024 | SSR react benchmarking                                                |                  :date:                   |
| 28/03/2024 | Shortname to Abbreviation in timing point rework                      | <sup>:heavy_check_mark:(19/04/2024)</sup> |
| 19/04/2024 | Prevent split modification once has any assigned times                |                  :date:                   |
| 19/04/2024 | Hide split name in SW when only 1 split for timing point exists       |                  :date:                   |
| 22/04/2024 | Containerize the application                                          |                  :date:                   |
| 26/04/2024 | Classification based start times                                      |                  :date:                   |
| 29/04/2024 | Manual players assignment to special categories                       |                  :date:                   |
| 30/04/2024 | Save button disabled until any changes are made                       |                  :date:                   |
| 03/05/2024 | Support for imperial metric system                                    |                  :date:                   |

## TODO

-   reassign clock out time to different player :heavy_check_mark:
-   clock out from dialpad :heavy_check_mark:
-   reset clocked out time :heavy_check_mark:
-   clocked time adjustments by <button +0.1 sec /> | <button -0.1 sec /> :heavy_check_mark:
-   autocomplete based on times from previous timekeepers :heavy_check_mark:
-   DNF/DSQ support :heavy_check_mark:
-   mobile friendly results list :heavy_check_mark:
-   next and current player hint on watch :heavy_check_mark:
-   make it harder to remove the splitTimes :heavy_check_mark:
-   option to re-activate removed splittime
-   fetch time from server :heavy_check_mark:
-   disable pull to refresh :heavy_check_mark:
-   persist selected timekeeper :heavy_check_mark:
-   NTP protocol implementation :heavy_check_mark:
-   actions log
-   authentication
-   real-time starting list sync
-   easier starting list fillout than passing .csv's
-   beep in countdown watch :heavy_check_mark:
-   more mobile-friendly results and starting list :heavy_check_mark:
-   times on time trial starting list :heavy_check_mark:
-   persist countdown watch settings
-   auto teams classifications :heavy_check_mark:
-   auto GC classification calculation :heavy_check_mark:
-   SMS notification with the result
-   fetching results from external system :heavy_check_mark:
-   fix gallery photo download :heavy_check_mark:
-   fullscreen mode for timer :heavy_check_mark:
-   fix skipping seconds :heavy_check_mark:
