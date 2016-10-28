tui.util.defineNamespace("fedoc.content", {});
fedoc.content["components_tooltips_groupTooltipPositionModel.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview GroupTooltipPositionModel is position model for group tooltip..\n * @author NHN Ent.\n *         FE Development Lab &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar chartConst = require('../../const/');\n\nvar GroupTooltipPositionModel = tui.util.defineClass(/** @lends GroupTooltipPositionModel.prototype */ {\n    /**\n     * GroupTooltipPositionModel is position model for group tooltip.\n     * @constructs GroupTooltipPositionModel\n     * @param {{width: number, height: number}} chartDimension chart dimension\n     * @param {{\n     *      dimension: {width: number, height: number},\n     *      position: {left: number, top: number}\n     * }} areaBound tooltip area bound\n     * @param {boolean} isVertical whether vertical or not\n     * @param {{align: ?string, position: {left: number, top: number}}} options tooltip options\n     */\n    init: function(chartDimension, areaBound, isVertical, options) {\n        /**\n         * chart dimension\n         * @type {{width: number, height: number}}\n         */\n        this.chartDimension = chartDimension;\n\n        /**\n         * tooltip area bound\n         * @type {{dimension: {width: number, height: number}, position: {left: number, top: number}}}\n         */\n        this.areaBound = areaBound;\n\n        /**\n         * Whether vertical or not\n         * @type {boolean}\n         */\n        this.isVertical = isVertical;\n\n        /**\n         * tooltip options\n         * @type {{align: ?string, position: {left: number, top: number}}}\n         */\n        this.options = options;\n\n        /**\n         * For caching\n         * @type {object}\n         */\n        this.positions = {};\n\n        this._setData(chartDimension, areaBound, isVertical, options);\n    },\n\n    /**\n     * Get horizontal direction.\n     * @param {?string} alignOption align option\n     * @returns {string} direction\n     * @private\n     */\n    _getHorizontalDirection: function(alignOption) {\n        var direction;\n\n        alignOption = alignOption || '';\n        if (alignOption.indexOf('left') > -1) {\n            direction = chartConst.TOOLTIP_DIRECTION_BACKWARD;\n        } else if (alignOption.indexOf('center') > -1) {\n            direction = chartConst.TOOLTIP_DIRECTION_CENTER;\n        } else {\n            direction = chartConst.TOOLTIP_DIRECTION_FORWARD;\n        }\n\n        return direction;\n    },\n\n    /**\n     * Make vertical data.\n     * @param {{width: number, height: number}} chartDimension chart dimension\n     * @param {{\n     *      dimension: {width: number, height: number},\n     *      position: {left: number, top: number}\n     * }} areaBound tooltip area bound\n     * @param {?string} alignOption align option\n     * @returns {{\n     *      positionType: string, sizeType: string, direction: (string),\n     *      areaPosition: number, areaSize: number, chartSize: number,\n     *      basePosition: (number)\n     * }} vertical data\n     * @private\n     */\n    _makeVerticalData: function(chartDimension, areaBound, alignOption) {\n        var hDirection = this._getHorizontalDirection(alignOption);\n\n        return {\n            positionType: 'left',\n            sizeType: 'width',\n            direction: hDirection,\n            areaPosition: areaBound.position.left,\n            areaSize: areaBound.dimension.width,\n            chartSize: chartDimension.width,\n            basePosition: chartConst.SERIES_EXPAND_SIZE\n        };\n    },\n\n    /**\n     * Get vertical direction.\n     * @param {?string} alignOption align option\n     * @returns {string} direction\n     * @private\n     */\n    _getVerticalDirection: function(alignOption) {\n        var direction;\n\n        alignOption = alignOption || '';\n\n        if (alignOption.indexOf('top') > -1) {\n            direction = chartConst.TOOLTIP_DIRECTION_BACKWARD;\n        } else if (alignOption.indexOf('bottom') > -1) {\n            direction = chartConst.TOOLTIP_DIRECTION_FORWARD;\n        } else {\n            direction = chartConst.TOOLTIP_DIRECTION_CENTER;\n        }\n\n        return direction;\n    },\n\n    /**\n     * Make horizontal data.\n     * @param {{width: number, height: number}} chartDimension chart dimension\n     * @param {{\n     *      dimension: {width: number, height: number},\n     *      position: {left: number, top: number}\n     * }} areaBound tooltip area bound\n     * @param {?string} alignOption align option\n     * @returns {{\n     *      positionType: string, sizeType: string, direction: (string),\n     *      areaPosition: number, areaSize: number, chartSize: number,\n     *      basePosition: (number)\n     * }} horizontal data\n     * @private\n     */\n    _makeHorizontalData: function(chartDimension, areaBound, alignOption) {\n        var vDirection = this._getVerticalDirection(alignOption);\n\n        return {\n            positionType: 'top',\n            sizeType: 'height',\n            direction: vDirection,\n            areaPosition: areaBound.position.top,\n            areaSize: areaBound.dimension.height,\n            chartSize: chartDimension.height,\n            basePosition: chartConst.SERIES_EXPAND_SIZE\n        };\n    },\n\n    /**\n     * Set data.\n     * @param {{width: number, height: number}} chartDimension chart dimension\n     * @param {{\n     *      dimension: {width: number, height: number},\n     *      position: {left: number, top: number}\n     * }} areaBound tooltip area bound\n     * @param {boolean} isVertical whether vertical or not\n     * @param {{align: ?string, position: {left: number, top: number}}} options tooltip options\n     * @private\n     */\n    _setData: function(chartDimension, areaBound, isVertical, options) {\n        var verticalData = this._makeVerticalData(chartDimension, areaBound, options.align);\n        var horizontalData = this._makeHorizontalData(chartDimension, areaBound, options.align);\n        var offset = options.offset || {};\n\n        if (isVertical) {\n            this.mainData = verticalData;\n            this.subData = horizontalData;\n        } else {\n            this.mainData = horizontalData;\n            this.subData = verticalData;\n        }\n\n        this.positionOption = {};\n        this.positionOption.left = offset.x || 0;\n        this.positionOption.top = offset.y || 0;\n\n        this.positions = {};\n    },\n\n    /**\n     * Calculate main position value.\n     * @param {number} tooltipSize tooltip size (width or height)\n     * @param {{start: number, end: number}} range range\n     * @param {object} data data\n     *      @param {string} data.direction direction\n     *      @param {number} data.basePosition basePosition\n     * @returns {number} position value\n     * @private\n     */\n    _calculateMainPositionValue: function(tooltipSize, range, data) {\n        var isLine = (range.start === range.end),\n            lineTypePadding = 9,\n            otherTypePadding = 5,\n            padding = isLine ? lineTypePadding : otherTypePadding,\n            value = data.basePosition;\n\n        if (data.direction === chartConst.TOOLTIP_DIRECTION_FORWARD) {\n            value += range.end + padding;\n        } else if (data.direction === chartConst.TOOLTIP_DIRECTION_BACKWARD) {\n            value += range.start - tooltipSize - padding;\n        } else if (isLine) {\n            value += range.start - tooltipSize / 2;\n        } else {\n            value += range.start + ((range.end - range.start - tooltipSize) / 2);\n        }\n\n        return value;\n    },\n\n    /**\n     * Calculate sub position value.\n     * @param {number} tooltipSize tooltip size (width or height)\n     * @param {object} data data\n     *      @param {number} data.areaSize tooltip area size (width or height)\n     *      @param {string} data.direction direction\n     *      @param {number} data.basePosition basePosition\n     * @returns {number} position value\n     * @private\n     */\n    _calculateSubPositionValue: function(tooltipSize, data) {\n        var middle = data.areaSize / 2,\n            value;\n\n        if (data.direction === chartConst.TOOLTIP_DIRECTION_FORWARD) {\n            value = middle + data.basePosition;\n        } else if (data.direction === chartConst.TOOLTIP_DIRECTION_BACKWARD) {\n            value = middle - tooltipSize + data.basePosition;\n        } else {\n            value = middle - (tooltipSize / 2) + data.basePosition;\n        }\n\n        return value;\n    },\n\n    /**\n     * Make position value diff.\n     * @param {number} value positoin value\n     * @param {number} tooltipSize tooltip size (width or height)\n     * @param {object} data data\n     *      @param {number} data.chartSize chart size (width or height)\n     *      @param {number} data.areaPosition tooltip area position (left or top)\n     * @returns {number} diff\n     * @private\n     */\n    _makePositionValueDiff: function(value, tooltipSize, data) {\n        return value + data.areaPosition + tooltipSize - data.chartSize;\n    },\n\n    /**\n     * Adjust backward position value.\n     * @param {number} value position value\n     * @param {{start: number, end: number}} range range\n     * @param {number} tooltipSize tooltip size (width or height)\n     * @param {object} data data\n     *      @param {number} data.chartSize chart size (width or height)\n     *      @param {number} data.areaPosition tooltip area position (left or top)\n     *      @param {number} data.basePosition basePosition\n     * @returns {number} position value\n     * @private\n     */\n    _adjustBackwardPositionValue: function(value, range, tooltipSize, data) {\n        var changedValue;\n\n        if (value &lt; -data.areaPosition) {\n            changedValue = this._calculateMainPositionValue(tooltipSize, range, {\n                direction: chartConst.TOOLTIP_DIRECTION_FORWARD,\n                basePosition: data.basePosition\n            });\n            if (this._makePositionValueDiff(changedValue, tooltipSize, data) > 0) {\n                value = -data.areaPosition;\n            } else {\n                value = changedValue;\n            }\n        }\n\n        return value;\n    },\n\n    /**\n     * Adjust forward position value.\n     * @param {number} value position value\n     * @param {{start: number, end: number}} range range\n     * @param {number} tooltipSize tooltip size (width or height)\n     * @param {object} data data\n     *      @param {number} data.chartSize chart size (width or height)\n     *      @param {number} data.areaPosition tooltip area position (left or top)\n     *      @param {number} data.basePosition basePosition\n     * @returns {number} position value\n     * @private\n     */\n    _adjustForwardPositionValue: function(value, range, tooltipSize, data) {\n        var diff = this._makePositionValueDiff(value, tooltipSize, data),\n            changedValue;\n\n        if (diff > 0) {\n            changedValue = this._calculateMainPositionValue(tooltipSize, range, {\n                direction: chartConst.TOOLTIP_DIRECTION_BACKWARD,\n                basePosition: data.basePosition\n            });\n            if (changedValue &lt; -data.areaPosition) {\n                value -= diff;\n            } else {\n                value = changedValue;\n            }\n        }\n\n        return value;\n    },\n\n    /**\n     * Adjust main position value\n     * @param {number} value position value\n     * @param {{start: number, end: number}} range range\n     * @param {number} tooltipSize tooltip size (width or height)\n     * @param {object} data data\n     *      @param {number} data.chartSize chart size (width or height)\n     *      @param {number} data.areaPosition tooltip area position (left or top)\n     * @returns {number} position value\n     * @private\n     */\n    _adjustMainPositionValue: function(value, range, tooltipSize, data) {\n        if (data.direction === chartConst.TOOLTIP_DIRECTION_BACKWARD) {\n            value = this._adjustBackwardPositionValue(value, range, tooltipSize, data);\n        } else if (data.direction === chartConst.TOOLTIP_DIRECTION_FORWARD) {\n            value = this._adjustForwardPositionValue(value, range, tooltipSize, data);\n        } else {\n            value = Math.max(value, -data.areaPosition);\n            value = Math.min(value, data.chartSize - data.areaPosition - tooltipSize);\n        }\n\n        return value;\n    },\n\n    /**\n     * Adjust sub position value.\n     * @param {number} value position value\n     * @param {number} tooltipSize tooltip size (width or height)\n     * @param {object} data data\n     *      @param {number} data.chartSize chart size (width or height)\n     *      @param {number} data.areaPosition tooltip area position (left or top)\n     *      @param {number} data.basePosition basePosition\n     * @returns {number} position value\n     * @private\n     */\n    _adjustSubPositionValue: function(value, tooltipSize, data) {\n        if (data.direction === chartConst.TOOLTIP_DIRECTION_FORWARD) {\n            value = Math.min(value, data.chartSize - data.areaPosition - tooltipSize);\n        } else {\n            value = Math.max(value, -data.areaPosition);\n        }\n\n        return value;\n    },\n\n    /**\n     * Make caching key.\n     * @param {{start: number, end: number}} range range\n     * @returns {string} key\n     * @private\n     */\n    _makeCachingKey: function(range) {\n        return range.start + '-' + range.end;\n    },\n\n    /**\n     * Add position option.\n     * @param {number} position position\n     * @param {string} positionType position type (left or top)\n     * @returns {number} position\n     * @private\n     */\n    _addPositionOptionValue: function(position, positionType) {\n        return position + this.positionOption[positionType];\n    },\n\n    /**\n     * Make main position value.\n     * @param {{width: number, height: number}} tooltipDimension tooltip dimension\n     * @param {{start: number, end: number}} range tooltip sector range\n     * @param {{\n     *      positionType: string, sizeType: string, direction: (string),\n     *      areaPosition: number, areaSize: number, chartSize: number,\n     *      basePosition: (number)\n     * }} main main data\n     * @returns {number} position value\n     * @private\n     */\n    _makeMainPositionValue: function(tooltipDimension, range, main) {\n        var value;\n\n        value = this._calculateMainPositionValue(tooltipDimension[main.sizeType], range, main);\n        value = this._addPositionOptionValue(value, main.positionType);\n        value = this._adjustMainPositionValue(value, range, tooltipDimension[main.sizeType], main);\n\n        return value;\n    },\n\n    /**\n     * Make sub position value.\n     * @param {{width: number, height: number}} tooltipDimension tooltip dimension\n     * @param {{\n     *      positionType: string, sizeType: string, direction: (string),\n     *      areaPosition: number, areaSize: number, chartSize: number,\n     *      basePosition: (number)\n     * }} sub sub data\n     * @returns {number} position value\n     * @private\n     */\n    _makeSubPositionValue: function(tooltipDimension, sub) {\n        var value;\n\n        value = this._calculateSubPositionValue(tooltipDimension[sub.sizeType], sub);\n        value = this._addPositionOptionValue(value, sub.positionType);\n        value = this._adjustSubPositionValue(value, tooltipDimension[sub.sizeType], sub);\n\n        return value;\n    },\n\n    /**\n     * Calculate group tooltip position.\n     * @param {{width: number, height: number}} tooltipDimension tooltip dimension\n     * @param {{start: number, end: number}} range tooltip sector range\n     * @returns {{left: number, top: number}} group tooltip position\n     */\n    calculatePosition: function(tooltipDimension, range) {\n        var key = this._makeCachingKey(range),\n            main = this.mainData,\n            sub = this.subData,\n            position = this.positions[key];\n\n        if (!position) {\n            position = {};\n            position[main.positionType] = this._makeMainPositionValue(tooltipDimension, range, main);\n            position[sub.positionType] = this._makeSubPositionValue(tooltipDimension, sub);\n            this.positions[key] = position;\n        }\n\n        return position;\n    },\n\n    /**\n     * Update tooltip options for position calculation.\n     * @param {{align: ?string, position: {left: number, top: number}}} options tooltip options\n     */\n    updateOptions: function(options) {\n        this.options = options;\n        this._setData(this.chartDimension, this.areaBound, this.isVertical, options);\n    },\n\n    /**\n     * Update tooltip bound for position calculation.\n     * @param {{\n     *      dimension: {width: number, height: number},\n     *      position: {left: number, top: number}\n     * }} bound tooltip area bound\n     */\n    updateBound: function(bound) {\n        this.areaBound = bound;\n        this._setData(this.chartDimension, bound, this.isVertical, this.options);\n    }\n});\n\nmodule.exports = GroupTooltipPositionModel;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"