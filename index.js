const app = new Vue({
  el: "#app",
  data: {
    //音乐列表数据
    musicList: [],
    // 记录用户搜索
    search: "华晨宇",
    // 记录歌曲图片地址
    musicImg: "https://p2.music.126.net/ADvaPgdenbCAFIQFlNMYcA==/19154592067652749.jpg",
    // 记录当前歌曲地址
    musicSrc: "",
    // 记录歌曲评论数据
    musicCommentData: "",
    // 记录播放状态
    musicPlay: false,
    // 记录歌词数据
    lyric: [],
    // 记录是否显示歌词
    lyricShow: true,
    // 记录当前播放对应的歌词下标
    lyricIndex: null,
    // 记录歌词滚动距离
    lyricTop: null,
    // 记录当前播放歌曲ID
    musicId: null,
    // 记录下一曲按钮禁用状态
    nextBut: true,
  },
  async created() {
    // 初始化渲染推荐歌曲
    this.searchMusic()
  },
  methods: {
    // 发送搜索请求
    async searchMusic() {
      this.musicList = [];
      let res = await axios.get(" https://autumnfish.cn/search?keywords=" + this.search);
      this.musicList = res.data.result.songs;
      // console.log(res);
      // console.log(this.musicList);
    },
    // 双击歌曲发送请求，渲染图片
    async dblMusicImg(id) {
      this.musicId = id;
      // 判断改变下一曲按钮状态
      this.nextBut = this.nextBut? !this.nextBut : this.nextBut;
      let res = await axios.get("https://autumnfish.cn/song/detail?ids=" + id);
      this.musicImg = res.data.songs[0].al.picUrl;
      // 调用播放歌曲
      this.playMusic(id);
      // 调用获取评论
      this.musicComment(id);
      // 修改播放状态
      this.musicPlay = true;
      // 调用获取歌词
      this.requestLyric(id);
    },
    // 播放歌曲
    async playMusic(id) {
      let res = await axios.get("https://autumnfish.cn/song/url?id=" + id);
      this.musicSrc = res.data.data[0].url;
      console.log(res);
      // this.musicSrc = 
    },

    // 歌曲评论
    async musicComment(id) {
      this.musicCommentData = [];
      let res = await axios.get("https://autumnfish.cn/comment/hot?type=0&id=" + id);
      this.musicCommentData = res.data.hotComments;
      // console.log(this.musicCommentData);
    },

    // 点击播放音乐
    cliPlay() {
      this.musicPlay = true;
    },
    // 点击暂停音乐
    clipause() {
      this.musicPlay = false;
    },

    // 获取歌词
    async requestLyric(id) {
      this.lyric = [];
      let res = await axios.get("https://autumnfish.cn/lyric?id=" + id);
      console.log(res.data.lrc.lyric);
      let a = (res.data.lrc.lyric).split("\n");
      a.forEach(item => {
        let t = item.slice(item.indexOf('[') + 1, item.indexOf(']'))
        let f = t.split(":")[0] * 60
        let m = t.split(":")[1];
        t = Number(f) + Number(m);
        let c = item.slice(item.indexOf(']') + 1)
        this.lyric.push({
          t: t,
          c: c
        })
      });
      // let lyricReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
      // this.lyric = a.map(item => {
      //   return item.replace(lyricReg, "")
      // })
      // console.log(this.lyric);
    },

    // 点击更改歌词显示状态
    dblLyricShow() {
      this.lyricShow = !this.lyricShow;
    },
    // 歌曲播放完后自动播放下一曲
    songEnd() {
      let id;
      this.musicList.forEach((item, index) => {
        if (item.id == this.musicId) {
          id = this.musicList[index + 1].id;
        }
      })
      // let i = Math.floor(Math.random() * this.musicList.length);
      // let id = this.musicList[i].id;
      // 调用播放音乐
      this.dblMusicImg(id)
    },
    // 同步歌词滚动
    lyricMovs() {
      const audio = document.querySelector("audio");
      let t = audio.currentTime;
      this.lyric.forEach((item, index) => {
        if (t >= item.t) {
          this.lyricIndex = index;
          this.lyricTop = -index * 16 + 120
        }
      })
    },
    // 点击歌词跳转播放位置
    cliLyric(t) {
      this.lyricSite = t;
      const audio = document.querySelector("audio");
      audio.currentTime = t;
    }
  },
  computed: {
    // 监听歌词距离改变更新DOM
    lyricMov() {
      return this.lyricTop
    },
  }
})