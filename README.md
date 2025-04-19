# IDSN-531-Final-project: Easy Pantry

## Reusable Header

A reusable header component is written in the `header.js` file. To include it on your page, add a `div` with `id="header"` to your page where you'd like the header to appear, and include the following script tags in the `<head>` tag of your page:

```
<script src="header.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        addHeader("{NAVLINK-ID}");
    });
</script>
```

Make sure to replace `{NAVLINK-ID}` with the id of the link to your page in the `header.js` file.
