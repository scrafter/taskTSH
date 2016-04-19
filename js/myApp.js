var app = angular.module('myApp', []);


app.controller('mainCtrl', function($scope, $http) {
    
    $scope.checkValue = function() {
        if($scope.rating > 5) $scope.rating = 5;
        if($scope.rating < 1) $scope.rating = 1;
    }
    
    $scope.loadRecords = function(query) {
        $http.get('http://test-api.kuria.tshdev.io/' + query)
        .then(function(res) {
            $scope.pages = res.data.pagination;
            $scope.payments = res.data.payments; 

        });
    }
    
    $scope.searchRecords = function() {
        var query = '?';
        if($scope.rating && $scope.search) query += 'query=' + $scope.search + '&rating=' + $scope.rating;
        if($scope.rating && !$scope.search) query += 'rating=' + $scope.rating;
        if($scope.search && !$scope.rating) query += 'query=' + $scope.search;
        $scope.loadRecords(query);
    }
    
    $scope.reset = function() {
        $scope.search = '';
        $scope.rating = 0;
        $scope.loadRecords('');
    }
    
    $scope.quit = function() {
        $('#detailBox').hide();
    }
    
    $scope.switchPage = function(page) {
        $scope.loadRecords('?' + page);
    }
    
    $scope.nextPage = function() {
        var query = $scope.pages.links[0].slice(0, -1);
        query += parseInt($scope.pages.current, 10) + 1;
        $scope.loadRecords('?' + query);
    }
    
    $scope.prevPage = function() {
        var query = $scope.pages.links[0].slice(0, -1);
        query += parseInt($scope.pages.current, 10) - 1;
        $scope.loadRecords('?' + query);
    }
    
    $scope.showRating = function(nr, element) {
        element.html('');
        
        for(var i = 0; i < nr; i++) {
            element.append('<div class="rating-active"></div>');
        }
        for(var i = 0; i < 5 - nr; i++) {
            element.append('<div class="rating"></div>');
        }
    }
    
    $scope.showDetails = function(index) {
        $('#detailBox > #supplier > .content').text($scope.payments[index].payment_supplier);
        $('#detailBox > #reference > .content').text($scope.payments[index].payment_ref);
        $('#detailBox > #value > .content').text('£' + $scope.payments[index].payment_amount);
        
        var rating = $scope.payments[index].payment_cost_rating;
        $scope.showRating(rating, $('#detailBox > #pound-rating > .content'))
        
        $('#detailBox').show();
    }
    
    $scope.loadRecords('');
});

app.filter('page', function() {
    return function(input) {
        input = parseInt(input, 10) + 1;
        return input;
    }
});