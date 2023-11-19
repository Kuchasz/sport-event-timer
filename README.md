# sport-event-timer

Application for making time measurements

## Ideas

| Added Date | Idea                                                       | Status                          |
| ---------- | ---------------------------------------------------------- | ------------------------------- |
| 07/09/2023 | Race must have at least 2 Timing Points                    | :heavy_check_mark: (12/09/2023) |
| 07/09/2023 | Tenant must have at least one Race                         | todo :date:                     |
| 07/09/2023 | Prevent Start Time and Bib Number duplication              | todo :date:                     |
| 07/09/2023 | Unify AccessUrl and ApiKey naming conventions              | :heavy_check_mark: (07/09/2023) |
| 08/09/2023 | Solve issue of sync between Player and Player Registration | :heavy_check_mark: (11/09/2023) |
| 10/09/2023 | Indeterminate state on save buttons                        | :heavy_check_mark: (20/09/2023) |
| 11/09/2023 | Fallback for public routes triggered with invalid raceId   | todo :date:                     |
| 13/09/2023 | Turn prisma seed into 'example race generation' button     | :heavy_check_mark: (13/09/2023) |
| 14/09/2023 | Allow example race customization                           | :heavy_check_mark: (14/09/2023) |
| 14/09/2023 | Country names localization                                 | :heavy_check_mark: (14/09/2023) |
| 17/09/2023 | Fix grid reload on data changes (updated)                  | :heavy_check_mark: (18/09/2023) |
| 19/09/2023 | Support for laps on timing point                           | todo :date:                     |
| 19/09/2023 | Add notifications to successful/failed actions             | todo :date:                     |
| 25/09/2023 | Short name for Timing Points                               | :heavy_check_mark: (25/09/2023) |
| 01/10/2023 | Speed up application build and release times               | :heavy_check_mark: (03/10/2023) |
| 03/10/2023 | Start new race selection dashboard                         | :heavy_check_mark: (17/10/2023) |
| 17/10/2023 | Sport discipline specification                             | :heavy_check_mark: (24/10/2023) |
| 19/10/2023 | Fix many jumping stuff on home page                        | :heavy_check_mark: (21/10/2023) |
| 20/10/2023 | Remove hard-coded application urls and ports               | :heavy_check_mark: (29/10/2023) |
| 20/10/2023 | Dates should use locale formats                            | todo :date:                     |
| 20/10/2023 | Configure linter + CI/CD pipeline                          | :heavy_check_mark: (23/10/2023) |
| 23/10/2023 | Simple website with registration, start list and results   | todo :date:                     |
| 23/10/2023 | Improve login page look                                    | todo :date:                     |
| 26/10/2023 | Start list .CSV import/export                              | todo :date:                     |
| 26/10/2023 | Add links to stopwatch and timer to the race panel         | :heavy_check_mark: (29/10/2023) |
| 26/10/2023 | Timer for finish line                                      | todo :date:                     |
| 26/10/2023 | Races list quick search                                    | :heavy_check_mark: (25/10/2023) |
| 26/10/2023 | Players list rework (with quick search)                    | :heavy_check_mark: (04/11/2023) |
| 26/10/2023 | QR Code to results list                                    | :heavy_check_mark: (30/10/2023) |
| 27/10/2023 | Penalties management in panel                              | todo :date:                     |
| 27/10/2023 | Stopwatches locking                                        | todo :date:                     |
| 27/10/2023 | Panel language selector                                    | todo :date:                     |
| 27/10/2023 | DSQ support                                                | todo :date:                     |
| 27/10/2023 | Steps for race creation                                    | todo :date:                     |
| 27/10/2023 | Add stopwatch history to the race panel                    | todo :date:                     |
| 28/10/2023 | Replace onclick with mousedown in stopwatch (when needed)  | :heavy_check_mark: (29/10/2023) |
| 29/10/2023 | Change race and split time forms to use new component      | :heavy_check_mark: (29/10/2023) |
| 29/10/2023 | Localized example race data                                | :heavy_check_mark: (30/10/2023) |
| 29/10/2023 | Refactor all useFormState<T> hook usages                   | :heavy_check_mark: (29/10/2023) |
| 04/11/2023 | Display classification name instead of just id             | :heavy_check_mark: (04/11/2023) |
| 04/11/2023 | Add translation to Gender                                  | :heavy_check_mark: (05/11/2023) |
| 05/11/2023 | Add custom hideable scrollbar to side menu                 | :heavy_check_mark: (05/11/2023) |
| 06/11/2023 | Implement sort over columns to Data Table                  | todo :date:                     |
| 06/11/2023 | Bib Numbers print mechanism                                | todo :date:                     |
| 06/11/2023 | Printable start list                                       | todo :date:                     |
| 06/11/2023 | Printable results                                          | todo :date:                     |
| 06/11/2023 | Add participation cerfificates with printing               | todo :date:                     |
| 06/11/2023 | Badge counters on certain menu items                       | :heavy_check_mark: (06/11/2023) |
| 06/11/2023 | Special filters on Data Table(eg. for paid players)        | todo :date:                     |
| 07/11/2023 | Use Data Table on results                                  | todo :date:                     |
| 09/11/2023 | Persist some grid settings in url                          | todo :date:                     |
| 09/11/2023 | Animate chevron on switching to next player (start list)   | :heavy_check_mark: (13/11/2023) |
| 10/11/2023 | Enter to submit form                                       | :heavy_check_mark: (13/11/2023) |
| 12/11/2023 | Ability to edit basic race info from race panel            | todo :date:                     |
| 14/11/2023 | Replace NextAuth                                           | :heavy_check_mark: (19/11/2023) |

## TODO

-   reassign clock out time to different player :heavy_check_mark:
-   clock out from dialpad :heavy_check_mark:
-   reset clocked out time :heavy_check_mark:
-   clocked time adjustments by <button +0.1 sec /> | <button -0.1 sec /> :heavy_check_mark:
-   autocomplete based on times from previous timekeepers :heavy_check_mark:
-   DNF/DSQ support :heavy_check_mark:
-   mobile friendly results list :heavy_check_mark:
-   next and current player hint on watch :heavy_check_mark:
-   make it harder to remove the timestamps :heavy_check_mark:
-   option to re-activate removed timestamp
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
