# MyTasksWebApp

*Reactive HTML 5 task editor*


## Introduction

This project is an HTML 5 web application for managing tasks in a multi-user and authenticated environment; in particular, it performs AJAX calls to the dedicated RESTful web service (**MyTaskWebService**) so as to retrieve information.


## Building and running the project

[Jekyll](http://jekyllrb.com/) is required; in addition to this, its plugin for Babel must be installed, usually by executing (on Linux):

> sudo gem install jekyll
> sudo gem install jekyll-babel


Once Jekyll and its plugin are ready, you can go to the project's directory and run:

> jekyll serve


Please, note that the web application expects its dedicated web service to be running: the expected URL can be changed by editing **_config.yaml** in the project's root.



## Architectural notes


* **Jekyll** is the build technology for this web app, as it provides:

    * very fast project creation

    * a lightweight web server

    * embedded SASS processor

    * enhanced templating, provided by Liquid

    * plugins (especially Babel)

* **React** enables *declarative*, *component-based* interface - which means more results and fewer bugs

* **CSS 3** add a bit of elegance - for example, *selectors*, *shadows*, *box-sizing*, *gradients*
