<template>
    <a-layout>
        <a-layout-header class="g-header">
            <my-progress :percent="needpersent" :subpercent="usedpersent" :strokeWidth="8"
                :class="[breakpoint ? 'progressbreak' : 'progress']" />
            <input ref="inputfile" type="file" multiple="multiple" style="display:nono;width:0px;height:0px"
                @change="inputfile" />
            <div ref="uploadarea" class="g-uploadarea">
                <a-button class="g-upload" type="dashed" :size="size" ref="uploadbtn" @click="choosefile" block>
                    <p class="g-upload-drag-icon">
                        <a-icon class="icon" type="inbox" />
                    </p>
                    <p class="g-upload-text">Click or Drag file to this area to upload</p>
                    <p class="g-upload-hint">Support for multiple files</p>
                </a-button>
            </div>
        </a-layout-header>
        <a-layout-content class="g-content">
            <a-list>
                <upload-item v-for="(item, index) in fileList" :itemdata="item" :index="index"
                    :key="item.file.lastModified + '' + index" :disable="disable" @removefile="removefile"></upload-item>
            </a-list>
        </a-layout-content>
        <a-layout-footer class="g-footer">
            <a-button icon="upload" :size="size" @click="uploadfile" block>Upload</a-button>
        </a-layout-footer>
    </a-layout>
</template>
<script>
import UploadItem from "../components/UploadItem";
import MyProgress from "../components/MyProgress";

export default {
    name: "UploadPanel",
    components: {
        UploadItem,
        MyProgress
    },
    props: {
        breakpoint: Boolean
    },
    data: function () {
        return {
            size: "default",
            fileList: [],
            uploadindex: 0,
            disable: false,
            totalspace: 0,
            usedspace: 0,
            needspace: 0,
            usedpersent: 0,
            needpersent: 0
        };
    },
    computed: {},
    watch: {
        fileList: function () {
            this.computesizepersent();
        },
        usedspace: function () {
            this.computesizepersent();
        }
    },
    mounted: function () {
        this.$refs.uploadarea.ondragleave = e => {
            e.preventDefault();
        };
        this.$refs.uploadarea.ondrop = e => {
            e.preventDefault();
            const data = e.dataTransfer.files;
            if (data.length < 1) {
                return;
            }
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
                if (e.dataTransfer.files[i].type == "") {
                    continue;
                }
                let fileitem = {
                    file: null,
                    info: {
                        progress: 0,
                        status: 'upload',
                        type: ""
                    }
                };
                let filelistlength = this.fileList.length;
                if (filelistlength < 1) {
                    fileitem.file = e.dataTransfer.files[i];
                    fileitem.info.type = this.getfiletype(e.dataTransfer.files[i].name);
                    this.fileList.push(fileitem);
                } else {
                    let hasfile = true;
                    for (let m = 0; m < filelistlength; m++) {
                        if (
                            e.dataTransfer.files[i].name == this.fileList[m].name &&
                            e.dataTransfer.files[i].lastModified ==
                            this.fileList[m].lastModified
                        ) {
                            hasfile = false;
                            break;
                        }
                    }
                    if (hasfile) {
                        fileitem.file = e.dataTransfer.files[i];
                        fileitem.info.type = this.getfiletype(e.dataTransfer.files[i].name);
                        this.fileList.push(fileitem);
                    }
                }
            }
        };
        this.$refs.uploadarea.ondragenter = e => {
            e.preventDefault();
        };
        this.$refs.uploadarea.ondragover = e => {
            e.preventDefault();
        };
        this.getdiskinfo();
    },
    methods: {
        computesizepersent: function () {
            let length = this.fileList.length;
            let data = this.fileList;
            let size = 0;
            for (let i = 0; i < length; i++) {
                if (data[i].info.status != 'upload') continue;
                size = size + data[i].file.size;
            }
            this.needspace = this.usedspace + size;
            if (this.needspace > this.totalspace) {
                this.needpersent = 100;
                this.$message.error("File uploaded too large.", 10);
            } else {
                this.needpersent = (this.needspace / this.totalspace) * 100;
            }
            this.usedpersent = (this.usedspace / this.totalspace) * 100;
        },
        getdiskinfo: function () {
            this.axios.post("/api/getdiskinfo").then(response => {
                this.usedspace = response.data.usedspace;
                this.totalspace = response.data.totalspace;
            });
        },
        getfiletype: function (name) {
            return name
                .split(".")
                .pop()
                .toLowerCase();
        },
        inputfile: function () {
            let data = this.$refs.inputfile.files;
            if (data.length < 1) {
                return;
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].type == "") {
                    continue;
                }
                let fileitem = {
                    file: null,
                    info: {
                        progress: 0,
                        status: 'upload',
                        type: ""
                    }
                };
                let filelistlength = this.fileList.length;
                if (filelistlength < 1) {
                    fileitem.file = data[i];
                    fileitem.info.type = this.getfiletype(data[i].name);
                    this.fileList.push(fileitem);
                } else {
                    let hasfile = true;
                    for (let m = 0; m < filelistlength; m++) {
                        if (
                            data[i].name == this.fileList[m].name &&
                            data[i].lastModified == this.fileList[m].lastModified
                        ) {
                            hasfile = false;
                            break;
                        }
                    }
                    if (hasfile) {
                        fileitem.file = data[i];
                        fileitem.info.type = this.getfiletype(data[i].name);
                        this.fileList.push(fileitem);
                    }
                }
            }
            this.$refs.inputfile.value = "";
        },
        choosefile: function () {
            this.$refs.inputfile.dispatchEvent(new MouseEvent("click"));
        },
        removefile: function (index) {
            if (index <= this.uploadindex && this.uploadindex != 0) {
                this.uploadindex--;
            }
            this.fileList.splice(index, 1);
        },
        uploadfile: function () {
            if (this.fileList.length > 0 && this.fileList.length > this.uploadindex) {
                this.disable = true;
                let config = {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: progressEvent => {
                        var complete =
                            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
                        this.fileList[this.uploadindex].info.progress = complete;
                        // if (complete == 100) {
                        //   this.fileList[this.uploadindex].info.status = 'sub';
                        //   this.uploadindex++;
                        //   if (this.uploadindex < this.fileList.length) {
                        //     this.uploadfile();
                        //   } else {
                        //     this.disable = false;
                        //   }
                        // }
                    }
                };
                let parms = new FormData();
                parms.append(
                    "uploadfile",
                    this.fileList[this.uploadindex].file,
                    this.fileList[this.uploadindex].file.name
                );

                this.axios.post("/upload", parms, config).then(response => {
                    this.fileList[this.uploadindex].info.status = 'sub';
                    this.uploadindex++;
                    if (this.uploadindex < this.fileList.length) {
                        this.uploadfile();
                    } else {
                        this.disable = false;
                    }
                    this.getdiskinfo();
                }).catch(err => {
                    this.fileList[this.uploadindex].info.status = 'err';
                    this.uploadindex++;
                    this.$message.error("Upload failed,network error or server is down!", 5);
                    if (this.uploadindex < this.fileList.length) {
                        this.uploadfile();
                    } else {
                        this.disable = false;
                    }
                });
            }
        }
    }
};
</script>
<style lang="less">
.g-header {
    background: white;
    height: auto;
    padding: 4px 10px;

    .progress {
        margin: 10px 0px;
    }

    .progressbreak {
        margin: 10px 0px 10px 22px;
    }
}

.g-content {
    background-color: white;
    padding: 0px 10px;
    overflow-x: hidden;
    overflow-y: auto;
}

.g-footer {
    background: white;
    padding: 5px 10px;
}

.g-upload {
    padding-top: 5px;
    height: auto;

    p {
        line-height: 16px;
    }

    .g-upload-drag-icon {
        .icon {
            font-size: 48px;
        }
    }

    .g-upload-text {
        font-size: 16px;
        color: black;
    }

    .g-upload-hint {
        font-size: 14px;
        color: gray;
    }
}

.g-uploadarea {
    display: inline-block;
    width: 100%;
}
</style>
