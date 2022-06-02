const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playListMain = $('.playlist-main');
const slideList = $('.slide-list');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const heading = $('header h4');
const musicPlayer = $('.music-player');
const playButton = $('.btn-toggle-play');
const nextButton = $('.btn-next');
const prevButton = $('.btn-prev');
const randomButton = $('.btn-random');
const repeatButton = $('.btn-repeat');
const progress = $('#progress');
const favoriteList = $('.favorite-list');

const PLAYER_STORAGE_KEY = 'MH_STORAGE';


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isLooping: false,
    playedSong: [],
    playedFavoriteSong: [],
    favoriteSong: [],
    songs: [
        {
            name: 'Drive My Car',
            author: 'Deamn',
            path: './assets/songs/Drive-My-Car-DEAMN.flac',
            image: './assets/img/drive_my_car.jpg',
            top: 1,
            id: 'D1',
            favorite: false
        },
        {
            name: 'Carousel',
            author: 'Deamn',
            path: './assets/songs/Carousel-DEAMN.mp3',
            image: './assets/img/carousel.jpg',
            top: 2,
            id: 'D2',
            favorite: false
        },
        {
            name: 'Drown',
            author: 'Alle Farben',
            path: './assets/songs/Drown.flac',
            image: './assets/img/drown.jpg',
            top: 3,
            id: 'A1',
            favorite: false
        },
        {
            name: 'Fight',
            author: 'Deamn',
            path: './assets/songs/Fight-DEAMN.mp3',
            image: './assets/img/drive_my_car.jpg',
            top: 8,
            id: 'D3',
            favorite: false
        },
        {
            name: 'I Hope You Know',
            author: 'Mike William',
            path: './assets/songs/I-Hope-You-Know-Mike-Williams-Jonas-Aden.mp3',
            image: './assets/img/i_hope_you_know.jpg',
            top: 5,
            id: 'M1',
            favorite: false
        },
        {
            name: 'Oblivion',
            author: 'Dirty Palm',
            path: './assets/songs/Oblivion-Dirty-Palm-Micah-Martin.mp3',
            image: './assets/img/oblivion.jpg',
            top: 6,
            id: 'DI1',
            favorite: false
        },
        {
            name: 'Power',
            author: 'Interupt ft. Luna LePage',
            path: './assets/songs/Power-In-Your-Soul-Interupt-Luna-LePage.flac',
            image: './assets/img/power.jpg',
            top: 7,
            id: 'I1',
            favorite: false
        },
        {
            name: 'Reality',
            author: 'Lost Frequencies',
            path: './assets/songs/Reality-Lost-Frequencies-Janieck-Devy.mp3',
            image: './assets/img/reality.jpg',
            top: 4,
            id: 'R1',
            favorite: false
        },
        {
            name: 'The Way I Still Love You',
            author: 'Reynard Silva',
            path: './assets/songs/The-Way-I-Still-Love-You-Reynard-Silva.flac',
            image: './assets/img/still-love.jpg',
            top: 9,
            id: 'RE1',
            favorite: false
        },
    ],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom || false;
        this.isLooping = this.config.isLooping || false;
        this.currentIndex = this.config.idPlaying || 0;
        this.favoriteSong = this.config.favoriteSong || [];
        this.songs.forEach((element, index) => {
            if (this.favoriteSong.includes(index)) {
                element.favorite = true;
            }
        });
    },
    render: function () {
        var html = this.songs.map((song, index) => {
            return `
                <div id="${index}" class="song-item ${this.currentIndex === index ? 'active' : ''}">
                    <div class="thumbnail" style="background-image: url('${song.image}');">
                        <div id="${index}" class="thumb-icon"></div>
                    </div>
                    <div class="body">
                        <h4 class="name-song">${song.name}</h4>
                        <p class="author">${song.author}</p>
                    </div>
                    <div class="favorite ${song.favorite ? 'active' : ''}" id="${song.id}" title="Thích">
                        <i class="fas fa-heart"></i>
                    </div>
                </div>
            `
        });
        playListMain.innerHTML = html.join('');
    },
    renderTopSong: function () {
        var html = this.songs.map((song, index) => {
            if (song.top < 7) {
                return `
                    <div id="${index}" class="slide-item">
                        <div class="img-item">
                            <img src="${song.image}" alt="">
                            <div id="playing-icon"></div>
                            <div id="play-btn">
                                <i class="far fa-play-circle"></i>
                            </div>
                        </div>
                        <h4 class="title">
                            ${song.name}
                        </h4>
                        <p class="desc">
                            ${song.author}
                        </p>
                    </div>
                `
            }

        });
        slideList.innerHTML = html.join('');
    },
    handleEvent: function () {
        const _this = this;
        const cdAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 15000,
            iterations: Infinity
        });
        cdAnimation.pause();

        // Handle when click play button
        playButton.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //handle when audio play 
        audio.onplay = function () {
            _this.isPlaying = true;
            musicPlayer.classList.add('playing');
            if ($('.song-item.active .thumb-icon')) {
                $('.song-item.active .thumb-icon').classList.add('active');
            }
            $$('.slide-item').forEach(element => {
                if (_this.currentIndex == element.id) {
                    element.classList.add('active');
                }
            });
            cdAnimation.play();
        }

        //handle when audio pause 
        audio.onpause = function () {
            _this.isPlaying = false;
            musicPlayer.classList.remove('playing');
            if ($('.song-item.active .thumb-icon')) {
                $('.song-item.active .thumb-icon').classList.remove('active');
            }
            if ($('.slide-item.active')) {
                $('.slide-item.active').classList.remove('active');
            }
            cdAnimation.pause();
        }

        //handle when audio pause 
        audio.onended = function () {
            if (_this.isLooping) {
                audio.play();
            } else {
                nextButton.click();
            }
        }

        //Handle when time of song change
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressValue = audio.currentTime / audio.duration * 100;
                progress.value = progressValue;
                _this.loadProgress();
            }
        }

        progress.oninput = function () {
            audio.currentTime = progress.value * audio.duration / 100;
            audio.play();
            _this.loadProgress();
        }

        // Handle when click next button
        nextButton.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            if ($('.song-item.active')) {
                $('.song-item.active').classList.remove('active');
            }
            if ($('.thumb-icon.active')) {
                $('.thumb-icon.active').classList.remove('active');
            }

            $$('.song-item').forEach(element => {
                if (_this.currentIndex == element.id) {
                    element.classList.add('active');
                }
                if ($('.song-item.active .thumb-icon')) {
                    $('.song-item.active .thumb-icon').classList.add('active');
                }
            });
            _this.setConfig('idPlaying', _this.currentIndex);
            audio.play();
            _this.scrollToActiveSong();
        }

        // Handle wwhen click prev button
        prevButton.onclick = function () {
            if ($('.song-item.active')) {
                $('.song-item.active').classList.remove('active');
            }

            if ($('.thumb-icon.active')) {
                $('.thumb-icon.active').classList.remove('active');
            }

            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }

            $$('.song-item').forEach(element => {
                if (_this.currentIndex == element.id) {
                    element.classList.add('active');
                }
                if ($('.song-item.active .thumb-icon')) {
                    $('.song-item.active .thumb-icon').classList.add('active');
                }
            });
            _this.setConfig('idPlaying', _this.currentIndex);
            audio.play();
            _this.scrollToActiveSong();
        }

        // Handle when click random button
        randomButton.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomButton.classList.toggle('active', _this.isRandom);
        }

        // Handle when click repeat button
        repeatButton.onclick = function () {
            _this.isLooping = !_this.isLooping;
            _this.setConfig('isLooping', _this.isLooping);
            repeatButton.classList.toggle('active', _this.isLooping);
        }

        // Handle when click menu 
        $('.menu').onclick = function (e) {
            const homeElement = $(e.target.closest('.home-page'));
            const favoriteElement = $(e.target.closest('.favorite-list'));
            if ((!homeElement || !favoriteElement) && e.target.closest('li')) {
                _this.toastMessage('Cảnh báo','Tính năng đang được phát triển','warning');
            }
        }


        //Handle when click song item
        playListMain.onclick = function (e) {
            const songElement = e.target.closest(".song-item:not(.active)");
            const favoriteElement = e.target.closest(".favorite");
            if (songElement || favoriteElement) {
                if (songElement && !favoriteElement) {
                    _this.currentIndex = Number(songElement.id);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.setConfig('idPlaying', _this.currentIndex);

                    if ($('.song-item.active')) {
                        $('.song-item.active').classList.remove('active');
                    };
                    $$('.song-item').forEach(element => {
                        if (_this.currentIndex == element.id) {
                            element.classList.add('active');
                        }
                    });
                    _this.scrollToActiveSong();

                    if ($('.thumb-icon.active')) {
                        $('.thumb-icon.active').classList.remove('active');
                    }
                }

                if (favoriteElement) {
                    var favSong = favoriteElement.closest('.song-item').id;
                    var nameFavSong = favoriteElement.closest('.song-item').innerText;
                    if (favoriteElement.closest('.favorite.active')) {
                        _this.songs[favSong].favorite = false;
                        const idRemoveSong = _this.favoriteSong.indexOf(Number(favSong));
                        _this.favoriteSong.splice(idRemoveSong, 1);
                        if ($('.favorite-list.active')) {
                            $$('.song-item').forEach(element => {
                                if (element.id == favSong) {
                                    element.remove();
                                }
                            })
                        }
                        _this.toastMessage('Thành công',`Đã gỡ bài hát ${nameFavSong} khỏi danh sách Yêu Thích`,'success');
                    } else {
                        _this.songs[favSong].favorite = true;
                        _this.favoriteSong.push(_this.songs.indexOf(_this.songs[favSong]));
                        _this.toastMessage('Thành công',`Đã thêm bài hát ${nameFavSong} vào danh sách Yêu Thích`,'success')
                    }

                    _this.favoriteSong.sort();
                    _this.setConfig('favoriteSong', _this.favoriteSong);

                    favoriteElement.classList.toggle('active');
                }
            }


        }

        //Handle when click slide item
        slideList.onclick = function (e) {
            const imgItem = e.target.closest(".slide-item:not(.active) #play-btn");
            const nameItem = e.target.closest(".slide-item:not(.active) .title");
            if (imgItem || nameItem) {
                if (imgItem) {
                    _this.currentIndex = Number(imgItem.closest(".slide-item:not(.active)").id);
                } else {
                    _this.currentIndex = Number(nameItem.closest(".slide-item:not(.active)").id);
                }

                _this.loadCurrentSong();

                if ($('.song-item.active')) {
                    $('.song-item.active').classList.remove('active');
                }

                $$('.song-item').forEach(element => {
                    if (_this.currentIndex == element.id) {
                        element.classList.add('active');
                    }
                });

                if ($('.slide-item.active')) {
                    $('.slide-item.active').classList.remove('active');
                }

                $$('.slide-item').forEach(element => {
                    if (_this.currentIndex == element.id) {
                        element.classList.add('active');
                    }
                });

                if ($('.thumb-icon.active')) {
                    $('.thumb-icon.active').classList.remove('active');
                }
                $('.home-page').click();
                audio.play();
                _this.scrollToActiveSong();
            }
        };

        // Handle wwhen click favorite menu
        favoriteList.onclick = function (e) {
            $('.playlist-header').innerHTML = '<h3>Danh sách bài hát yêu thích</h3>'
            favoriteList.classList.add('active');
            $('.playlist-main').classList.add('favorite-list-main');
            $('.home-page').classList.remove('active');
            let coutFavSong = 0;
            let html = _this.songs.map((song, index) => {
                if (song.favorite) {
                    coutFavSong++;
                    return `
                            <div id="${index}" class="song-item">
                                <div class="thumbnail" style="background-image: url('${song.image}');">
                                    <div id="${index}" class="thumb-icon"></div>
                                </div>
                                <div class="body">
                                    <h4 class="name-song">${song.name}</h4>
                                    <p class="author">${song.author}</p>
                                </div>
                                <div class="favorite active" id="${song.id}" title="Thích">
                                    <i class="fas fa-heart"></i>
                                </div>
                            </div>
                        `
                }

            });



            if (coutFavSong > 0) {
                playListMain.innerHTML = html.join('');
                _this.currentIndex = _this.favoriteSong[0];
                _this.setConfig('idPlaying', _this.currentIndex);
                $$('.song-item').forEach(element => {
                    if (element.id == _this.currentIndex) {
                        element.classList.add('active')
                    }
                });
                _this.loadCurrentSong();
                audio.play();
            } else {
                playListMain.innerHTML = '<h4>Không có bài hát nào</h4>';
            }

            _this.scrollToActiveSong();
        }

        // Handle when click homepage
        $('.home-page').onclick = function (e) {
            $('.playlist-header').innerHTML = '<h3>Danh sách bài hát</h3>'
            _this.render();
            _this.scrollToActiveSong();
            $('.home-page').classList.add('active');
            $('.favorite-list').classList.remove('active');
            $('.playlist-main').classList.remove('favorite-list-main');
            if ($('.song-item.active .thumb-icon') && audio.currentTime > 0 && !audio.paused) {
                $('.song-item.active .thumb-icon').classList.add('active');
            }
        }

        // Pause when press space
        document.onkeydown = function (e) {
            if (e.which == 32) {
                e.preventDefault();
                if (_this.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
        }
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    toastMessage: function (title='',message='',type='') {
        const mainToast = $('#toast');
        if (mainToast) {
            const toast = document.createElement('div');
            const icons = {
                success: 'fas fa-check-circle',
                warning: 'fas fa-exclamation-circle',
            };
            const autoRemoveToast = setTimeout(() => {
                mainToast.removeChild(toast)
            }, 4000);

            toast.onclick = function (e) {
                if (e.target.closest('.toast-close')) {
                    mainToast.removeChild(toast);
                    clearTimeout(autoRemoveToast);
                }
            }

            toast.classList.add(`toast-${type}`);
            toast.innerHTML = `
                                <div class="toast-icon">
                                    <i class="${icons[type]}"></i>
                                </div>
                                <div class="toast-content">
                                    <h3 class="toast-title">${title}</h3>
                                    <p class="toast-desc">
                                        ${message}
                                    </p>
                                </div>
                                <div class="toast-close">
                                    <i class="fas fa-times"></i>
                                </div>
                        `
            mainToast.appendChild(toast);
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song-item.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 50);

    },
    loadCurrentSong: function () {
        if ($('.slide-item.active')) {
            $('.slide-item.active').classList.remove('active');
        }
        heading.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadProgress: function () {
        progress.style.background = `linear-gradient(90deg, #ec1f55 ${progress.value}%, #d3d3d3 ${progress.value}%)`;
    },
    nextSong: function () {
        if ($('.favorite-list.active')) {
            const songItemFav = $$('.song-item');
            let favListIndex = [];
            if (songItemFav.length > 0) {
                songItemFav.forEach(element => {
                    favListIndex.push(Number(element.id))
                });
                do {
                    this.currentIndex++;
                    if (this.currentIndex > favListIndex[favListIndex.length - 1]) {
                        this.currentIndex = favListIndex[0];
                    }
                } while (!favListIndex.includes(this.currentIndex));
            } else {
                this.currentIndex++;
                if (this.currentIndex >= this.songs.length) {
                    this.currentIndex = 0;
                }
            }
        } else {
            this.currentIndex++;
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
        }


        this.loadCurrentSong();
    },
    prevSong: function () {

        if ($('.favorite-list.active')) {
            const songItemFav = $$('.song-item');
            let favListIndex = [];
            if (songItemFav.length > 0) {
                songItemFav.forEach(element => {
                    favListIndex.push(Number(element.id))
                });
                do {
                    this.currentIndex--;
                    if (this.currentIndex < favListIndex[0]) {
                        this.currentIndex = favListIndex[favListIndex.length - 1];
                    }
                } while (!favListIndex.includes(this.currentIndex));
            } else {
                this.currentIndex--;
                if (this.currentIndex < 0) {
                    this.currentIndex = this.songs.length - 1;
                }
            }
        } else {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1;
            }
        }



        this.loadCurrentSong();
    },
    randomSong: function () {
        let newIndex;
        if (this.playedSong.length === 0 && audio.currentTime > 0) {
            this.playedSong.push(this.currentIndex);
        }
        if ($('.favorite-list.active') && this.favoriteSong.length > 0) {
            if (this.playedFavoriteSong.length === 0 && audio.currentTime > 0) {
                this.playedFavoriteSong.push(this.currentIndex);
            }
            if (this.playedFavoriteSong.length == this.favoriteSong.length) {
                this.playedFavoriteSong = [];
            }
            if (this.favoriteSong.length >= 2) {
                do {
                    newIndex = this.favoriteSong[Math.floor(Math.random() * this.favoriteSong.length)];
                } while (newIndex === this.currentIndex || this.playedFavoriteSong.includes(newIndex));
                this.playedFavoriteSong.push(newIndex);
            } else {
                newIndex = this.favoriteSong[0];
            }


        } else {
            if (this.playedSong.length == this.songs.length) {
                this.playedSong = [];
            }
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
            } while (newIndex === this.currentIndex || this.playedSong.includes(newIndex));

            this.playedSong.push(newIndex);
        }
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        if (!(localStorage.getItem(PLAYER_STORAGE_KEY) === null)) {
            this.loadConfig();
        }
        this.render();
        this.renderTopSong();
        this.scrollToActiveSong();
        this.handleEvent();
        this.defineProperties();
        this.loadCurrentSong();
        randomButton.classList.toggle('active', this.isRandom);
        repeatButton.classList.toggle('active', this.isLooping);
    }
}

app.start();