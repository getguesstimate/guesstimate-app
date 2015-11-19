import {Formatter} from './formatter.js'
import {Sampler} from './sampler.js'
import AbstractDistribution from '../abstract-distribution.js'

export var Distribution = new AbstractDistribution('normal', Formatter, Sampler)
