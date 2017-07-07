# nexus-npm

Node module to deploy artifact in sonatype nexus.

#### Requeriments

* Sonatype Nexus OSS with npm repository.
* Valid user from Nexus.
* Local machine authenticated with nexus.

#### Installation

```bash
# npm install -g nexus-npm
```

### Project configuration

In the `package.json` add the string `-SNAPSHOT` in the version attribute , and add this configuration:

```json
  "distributionManagement": {
    "releaseRegistry": "http://private-nexus.com/repository/npm-publish/",
    "snapshotRegistry": "http://private-nexus.com/repository/npm-snapshot/"
  }
```

#### Commands

* `$ nexus-npm deploy` - Generates a deploy in the nexus, if no parameter is informed generates a snapshot.
    Parameters accepted: 
    * *--release* - Generates a new project release;
    * *----tag [tagName]* - Informs the name of the tag to be generated;
    * *--commitPrefix [commigPrefix]* - Informs the prefix of the commit message. Se nada for informado, será utilizado o padrão "[nexus-npm] -"
* `$ nexus-npm verify` - check if configuration is correct.
* `$ nexus-npm clean` - removes generated files. 
* `$ nexus-npm rollback` - rollback the package.json to last status before a deploy execution.
