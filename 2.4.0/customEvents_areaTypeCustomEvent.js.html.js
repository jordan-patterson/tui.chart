tui.util.defineNamespace("fedoc.content", {});
fedoc.content["customEvents_areaTypeCustomEvent.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview AreaTypeCustomEvent is event handle layer for line type chart.\n * @author NHN Ent.\n *         FE Development Lab &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar CustomEventBase = require('./customEventBase');\nvar zoomMixer = require('./zoomMixer');\nvar AreaTypeDataModel = require('./areaTypeDataModel');\n\nvar AreaTypeCustomEvent = tui.util.defineClass(CustomEventBase, /** @lends AreaTypeCustomEvent.prototype */ {\n    /**\n     * AreaTypeCustomEvent is custom event for line type chart.\n     * @param {object} params parameters\n     * @constructs AreaTypeCustomEvent\n     * @extends CustomEventBase\n     */\n    init: function(params) {\n        CustomEventBase.call(this, params);\n\n        /**\n         * previous found data\n         * @type {null | object}\n         */\n        this.prevFoundData = null;\n\n        /**\n         * whether zoomable or not\n         * @type {boolean}\n         */\n        this.zoomable = params.zoomable;\n\n        if (this.zoomable) {\n            tui.util.extend(this, zoomMixer);\n            this._initForZoom(params.zoomable);\n        }\n    },\n\n    /**\n     * Initialize data of custom event\n     * @param {Array.&lt;object>} seriesInfos series infos\n     * @override\n     */\n    initCustomEventData: function(seriesInfos) {\n        var seriesInfo = seriesInfos[0];\n\n        this.dataModel = new AreaTypeDataModel(seriesInfo);\n        CustomEventBase.prototype.initCustomEventData.call(this, seriesInfos);\n\n        if (this.zoomable) {\n            this._showTooltipAfterZoom();\n        }\n    },\n\n    /**\n     * Find data by client position.\n     * @param {number} clientX - clientX\n     * @param {number} clientY - clientY\n     * @returns {object}\n     * @private\n     * @override\n     */\n    _findData: function(clientX, clientY) {\n        var layerPosition = this._calculateLayerPosition(clientX, clientY);\n\n        return this.dataModel.findData(layerPosition);\n    },\n\n    /**\n     * Get first model data.\n     * @param {number} index - index\n     * @returns {object}\n     * @private\n     */\n    _getFirstData: function(index) {\n        return this.dataModel.getFirstData(index);\n    },\n\n    /**\n     * Get last model data.\n     * @param {number} index - index\n     * @returns {object}\n     * @private\n     */\n    _getLastData: function(index) {\n        return this.dataModel.getLastData(index);\n    },\n\n    /**\n     * Show tooltip.\n     * @param {object} foundData - model data\n     * @private\n     */\n    _showTooltip: function(foundData) {\n        this.fire('showTooltip', foundData);\n    },\n\n    /**\n     * Hide tooltip.\n     * @private\n     */\n    _hideTooltip: function() {\n        this.fire('hideTooltip', this.prevFoundData);\n    },\n\n    /**\n     * On mousemove.\n     * @param {MouseEvent} e - mouse event\n     * @private\n     * @override\n     */\n    _onMousemove: function(e) {\n        var dragMoseupResult, foundData;\n\n        CustomEventBase.prototype._onMousemove.call(this, e);\n\n        foundData = this._findData(e.clientX, e.clientY);\n\n        if (this.zoomable) {\n            dragMoseupResult = this._isAfterDragMouseup();\n        }\n\n        if (dragMoseupResult || !this._isChangedSelectData(this.prevFoundData, foundData)) {\n            return;\n        }\n\n        if (foundData) {\n            this._showTooltip(foundData);\n        } else if (this.prevFoundData) {\n            this._hideTooltip();\n        }\n\n        this.prevFoundData = foundData;\n    },\n\n    /**\n     * On mouseout.\n     * @private\n     * @override\n     */\n    _onMouseout: function() {\n        if (this.prevFoundData) {\n            this._hideTooltip();\n        }\n\n        CustomEventBase.prototype._onMouseout.call(this);\n    }\n});\n\nmodule.exports = AreaTypeCustomEvent;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"