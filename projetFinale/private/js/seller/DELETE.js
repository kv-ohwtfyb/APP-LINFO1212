function fourchetteReduction(article){
    let min = 0;
    let max = 0;
    if (article.reductions.length === 0){
        return min, max
    }else{
        for (let i = 0; i < article.reductions.length; i++) {

            if (article.reductions[i].pourReduc > max){
                max = article.reductions[i].pourReduc;
            }

            if (article.reductions[i].pourReduc < min){
                min = article.reductions[i].pourReduc;
            }
        }
        return min, max
    }
}

