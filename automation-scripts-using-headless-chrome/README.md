## Automation Scripts Using Headless Chrome

This folder contains automation scripts for functional test cases in the
[Automation rules](https://netspective-medigy.pages.git.netspective.io/properties/management-publication/gpm/management/quality/automation-rules/)
which can be executed in headless chrome method.

#### How to run Test Scripts

This test can be executed within the 'automation-scripts-using-headless-chrome'
folder as mentioned.

```
❯ deno-test filename.ts
```

#### To Set environment variables

To set up environment variables and storing credentials, create a `.env` file in
this folder 'automation-scripts-using-headless-chrome'.

Then, assign the credentials in the following format inside the `.env` file.

```
USERNAME = test_test@test.com
PASSWORD = your password
LOGGED_NAME = Logged in User's Display name
```

Then import the configuration using the `config` function inside the .ts
scripts, if a new script is added. Otherwise, if a person just wants to execute
an existing script, no need to import the config funtion, and he can directly
execute any script in this folder as mentioned above.

```
import { config } from "https://deno.land/x/dotenv/mod.ts";
```

#### Install Puppeteer for the first time

For the first time users, we may need to execute the following command, unless
Puppeteer is not already installed.

```
❯ PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@9.0.1/install.ts
```
