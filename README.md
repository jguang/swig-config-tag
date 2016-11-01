# swig-config-tag

swig模板(https://www.npmjs.com/package/swig), 扩展的config标签，用于载入数据；


## 使用


1. 设置

```
swig.setTag('config', swigConfigTag.parse, swigConfigTag.compile, swigConfigTag.ends, swigConfigTag.blockLevel);

```

2. 模板加入

```
{%config foo = "config.json" %}



{{foo|json}}

```
