## Netspective Medigy Digital Properties Orchestrator

It will check all the SEO test cases by default for the production site

#### How to run SEO test for Sandbox

```bash
export DPO_SITE_ID='local'

deno-test
```

#### How to run SEO test for Production

If the environment variable (DPO_SITE_ID) is not set

```bash
deno-test
```

Otherwise

```bash
export DPO_SITE_ID='production'

deno-test
```

#### How to run SEO test for 2021 Medigy Development

```bash
export DPO_SITE_ID='development2021'

deno-test
```

#### How to run SEO test for 2022 Medigy Development

```bash
export DPO_SITE_ID='development2022'

deno-test
```

#### How to run SEO test for Medigy Claim Site Production

```bash
export DPO_SITE_ID='medigyClaims'

deno-test
```

#### How to run SEO test for Medigy Claim Site Local

```bash
export DPO_SITE_ID='medigyClaimsLocal'

deno-test
```

#### How to run SEO test for Medigy SLDS development

```bash
export DPO_SITE_ID='medigySlds'

deno-test
```

#### How to run DPO test for Medigy Prime based on category

```bash
deno-test --filter "AEC-MGYP-CA-ST"
deno-test --filter "AEC-MGYP-CA-FN"
deno-test --filter "AEC-MGYP-CA-CF"
deno-test --filter "AEC-MGYP-CA-CM"
deno-test --filter "AEC-MGYP-CA-L"
```

#### How to run DPO test for Medigy Claims based on category

```bash
deno-test --filter "AEC-MGYC-CA-ST"
deno-test --filter "AEC-MGYC-CA-FN"
```

#### Parameter based SEO Test Example

We can use filters based on the names

```bash
deno-test --filter "/Recognition  Award/"
```

#### How to change the accuracy of event, institution and community count checking

Now the default accuracy is given as 5%. You can change the accuracy by changing
the following variables on the top of the site.ts page.

```bash
const EVENT_COUNT_ACCURACY_PERCENTAGE = 5;
const INSTITUTION_COUNT_ACCURACY_PERCENTAGE = 5;
const COMMUNITY_COUNT_ACCURACY_PERCENTAGE = 5;
```

# TODO Refactoring required

- Create a log file for writing the test results
- Automatically run the DPO test cases after the sandbox deployment
- Made parameter based Tests for Sandboxes ( Modules can be given as input
  parameter )

  
# Deno Compatible Version 
# Installation Command

asdf install deno 1.22.1
asdf local deno 1.22.1

#  PUPPETEER Compatible Version

PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@14.1.1/install.ts






