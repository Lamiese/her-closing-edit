# Her Closing Edit

A fast, SEO-friendly website built with Eleventy (a static site generator), hosted on Netlify, with Decap CMS so you can edit content in your browser.

## How it works

1. All content lives in this GitHub repository.
2. When anything changes, Netlify rebuilds the site automatically (about a minute).
3. You edit articles, products, prices and settings at `yoursite.com/admin/`. Every save becomes a commit in GitHub, so nothing is ever lost.

## Setting it up

1. Create a new GitHub repository called `her-closing-edit` and upload everything in this folder.
2. In Netlify, choose Add new site, then Import from GitHub, and pick the repository. The build settings are read from `netlify.toml` automatically.
3. Add your domain under Domain management in Netlify.
4. Turn on the content manager:
   • Open `src/admin/config.yml` and replace `YOUR-GITHUB-USERNAME` with your GitHub username.
   • In GitHub, go to Settings, Developer settings, OAuth Apps, New OAuth App. Homepage URL: your site address. Callback URL: `https://api.netlify.com/auth/done`.
   • In Netlify, go to Site configuration, Access & security, OAuth, Install provider, choose GitHub and paste the Client ID and Secret.
   • Visit `yoursite.com/admin/` and log in with GitHub.
5. Turn on form emails: in Netlify, go to Forms, then Form notifications, and add an email notification to your existing email address for each form (free-guide, newsletter, contact). You’ll get an email for every signup and message, and can see and export them all in the Forms tab.

## Where things are

• Articles: `src/articles/` (or Journal articles in the admin)
• Products: `src/products/` (or Shop products)
• Policy pages: `src/legal/`
• Site settings, guide status, analytics, social links: `src/_data/site.json` (or Site settings)
• Homepage featured articles: `src/_data/home.json`
• Design: `src/assets/css/style.css`

## Switching things on later

• **Free guide live:** upload the PDF, connect the email service, test it, then set Guide status to Live and tick “Email delivery connected and tested”. The site wording updates itself.
• **Selling a product:** create a Stripe Payment Link, set its success URL to `https://yoursite.com/thank-you/purchase/?session_id={CHECKOUT_SESSION_ID}`, paste the link into the product’s Checkout link field, then set Status to Available. Until then, no buy button appears.
• **Analytics:** paste your GA4 ID into Site settings. A consent banner appears automatically and nothing is tracked unless a visitor accepts.
• **Search Console:** paste the HTML-tag verification code into Site settings, then submit `/sitemap.xml`.

## Tracked events

`free_guide_signup`, `email_subscription`, `contact_form_submission` fire on the thank-you pages, which visitors only reach after Netlify has successfully received the form. `product_view` fires on product pages, `begin_checkout` on buy-button clicks and `purchase` only when Stripe redirects back with a completed session. All require GA4 and visitor consent.
