// config-overrides.js
const fs = require('fs')
const path = require('path')
const config = require('./tsconfig.paths.json')

const { baseUrl, paths } = config.compilerOptions

const alias = Object.keys(paths).reduce( (a, path) => {
  const value = paths[path]
  const target = Array.isArray(value) ? value[0] : value
  a[path.replace(/\/\*$/,'')] = target.replace(/\/\*$/,'')
  return a
}, {})
const wpAlias = Object.keys(alias).reduce( (a,i) => {
  a[i] = path.resolve(baseUrl, alias[i])
  return a
}, {})

const aliasMapForJest = (baseUrl, aliasMap) => {
  return Object.keys(aliasMap).reduce((a, i) => {
    const restr = i.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const isDir = fs.lstatSync(`${baseUrl}/${aliasMap[i]}`).isDirectory()
    const alias = isDir ? `^${restr}/(.*)$` : `^${restr}$`
    const targ = isDir ? `<rootDir>/${baseUrl}/${aliasMap[i]}/$1` : `<rootDir>/${baseUrl}/${aliasMap[i]}`
    return { ...a, [alias]: targ }
  }, {})
}
const aliasJest = (options) => {
  return (config) => ({
    ...config,
    moduleNameMapper: {
      ...config.moduleNameMapper,
      ...aliasMapForJest(options.baseUrl, options.alias)
    }
  })
}
const aliasWebpack = (options) => {
  return (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: wpAlias,
    }
  })
}

const options = {
  alias,
  baseUrl,
}

module.exports = aliasWebpack(options)
module.exports.jest = aliasJest(options)
