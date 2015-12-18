### Installation
```npm install dolphin-angularjs-package --save```


### AngularJsConfigurationFactory

The factory has default methods:

methods:
* addModule - registration custom module

When you call "addModule" the plugin will read all folders in public folder:
```
package_folder
   public
      assets // just example for assets 
          css
          fonts
          images  
      controllers
      directives
      routes
      services
      views
```

Access to view folder you can get like this: `/Name_Of_Module/views`

`Notice!` you don't need to use AssetManager to merge all files from public folder! 


### Example
```
myModule.configureFactories(function (AngularJsConfigurationFactory) {
    //the first parameter is name of module for AngularJS
    //the second is variable of module
    AngularJsConfigurationFactory.addModule('test', test);
});
```