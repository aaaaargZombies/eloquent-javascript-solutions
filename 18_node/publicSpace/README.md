# A public space on the web

> Since the file server serves up any kind of file and even includes the right Content-Type header, you can use it to serve a website. Since it allows everybody to delete and replace files, it would be an interesting kind of website: one that can be modified, improved, and vandalized by everybody who takes the time to create the right HTTP request.
>
> Write a basic HTML page that includes a simple JavaScript file. Put the files in a directory served by the file server and open them in your browser.
>
> Next, as an advanced exercise or even a weekend project, combine all the knowledge you gained from this book to build a more user-friendly interface for modifying the website—from inside the website.
>
> Use an HTML form to edit the content of the files that make up the website, allowing the user to update them on the server by using HTTP requests, as described in Chapter 18.
>
> Start by making only a single file editable. Then make it so that the user can select which file to edit. Use the fact that our file server returns lists of files when reading a directory.
>
> Don’t work directly in the code exposed by the file server since if you make a mistake, you are likely to damage the files there. Instead, keep your work outside of the publicly accessible directory and copy it there when testing.

## Markdown Wiki

The obvious existing example of such a site is a wiki! I'd like to try and build one that uses markdown for editing and then use some of the ideas from chapter chapter 12 to compile the markdown to html and back again for editing.

### Spec

##### Stage One

- A div containing the content.
- An edit button to that turns the content into a text field.
- An save button to that turns the text field back into content.
- A method of processing the innerHtml of the div into markdown.
- A method of processing the markdown into html.
- Display the markdown syntax in the content so it's easier to compile to/from and so the interface is Discoverable.
- If a link is created to a new page, create that file at compile time.
- Starting text that explains how to get started.

##### Stage Two

- If leaving Markdown syntax in, figure out a way to present links and images in a way that doesn't take over visually.
- Upload images
- Revert to older versions
