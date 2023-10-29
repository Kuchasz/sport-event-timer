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
| 26/10/2023 | Players list rework (with quick search)                    | todo :date:                     |
| 26/10/2023 | QR Code to results list                                    | todo :date:                     |
| 27/10/2023 | Penalties management in panel                              | todo :date:                     |
| 27/10/2023 | Stopwatches locking                                        | todo :date:                     |
| 27/10/2023 | Panel language selector                                    | todo :date:                     |
| 27/10/2023 | DSQ support                                                | todo :date:                     |
| 27/10/2023 | Steps for race creation                                    | todo :date:                     |
| 27/10/2023 | Add stopwatch history to the race panel                    | todo :date:                     |
| 28/10/2023 | Replace onclick with mousedown in stopwatch (when needed)  | :heavy_check_mark: (29/10/2023) |

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
