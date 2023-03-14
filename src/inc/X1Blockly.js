import * as Blockly from "blockly";
import {createPlayground} from "@blockly/dev-tools";
import {download, getFileContent} from "./helpers";

class X1Blockly {
    constructor() {
        this.settings = {};
        this.plugins = [];

        this.updateData();
    }

    updateData(){
        this.data = window.x1data;

        if (typeof this.data.user === 'object') {
            this.user = this.data.user;
        }
    }

    setSettings(settings) {
        this.settings = settings;
    };

    use(pluginClass) {
        this.plugins.push(new pluginClass(this));
    }

    init(selector) {
        this.container = document.querySelector(selector);

        createPlayground(this.container, (container, options) => {
            return this.createWorkspace(container, options);
        }, {
            debugEnabled: true,
            toolbox: this.settings.toolbox,
            grid: {
                spacing: 25,
                length: 3,
                colour: '#ccc',
                snap: true,
            },
        });
    }

    createWorkspace(container, options) {
        this.container = container;
        this.blocklyOptions = options;

        this.workspace = Blockly.inject(container, options);

        this.plugins.forEach((plugin) => {
            plugin.init(this);
        });

        return this.workspace;
    }

    importWorkspace(json) {
        const serializer = new Blockly.serialization.blocks.BlockSerializer();

        try {
            serializer.load(JSON.parse(json), this.workspace);
        } catch (e) {
            console.error('Workspace import error: ', e);
            return false;
        }

        return true;
    }

    exportWorkspace() {
        const serializer = new Blockly.serialization.blocks.BlockSerializer();

        return JSON.stringify(serializer.save(this.workspace));
    }

    saveWorkspace() {
        const json = this.exportWorkspace();

        download(json, 'workspace.json', 'application/json');
    }

    loadWorkspace(fileinput) {
        getFileContent(fileinput).then((json) => {
            if (json) {
                this.importWorkspace(json);
            }
        });

        fileinput.value = null;
    }
}

window.x1blockly = new X1Blockly();

export default window.x1blockly;