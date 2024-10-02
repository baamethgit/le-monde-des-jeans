from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CommandeSerializer,PanierSerializer
from .models import Commande,Panier
from accounts.utils import verifier_user


class cartView(APIView):
    def get(self, request):
        user = verifier_user(request)
        panier, created = Panier.objects.get_or_create(client = user)
        serializer = PanierSerializer(panier, context={'request': request})
        return Response(serializer.data,status=status.HTTP_200_OK)

    # def post(self, request):
    #     data = request.data
    #     product_slug = data.get('product_slug')
    #     quantite = data.get('quantite', 1)  # la quantité est 1 par défaut

    #     if not product_slug:
    #         raise ValidationError("Le produit est nécessaire pour créer un article. {product_slug}")

    #     produit = Produit.objects.filter(slug=product_slug).first()
    #     if not produit:
    #         raise NotFound("Produit non trouvé.")

    #     user = verifier_user(request)
    #     panier, created = Panier.objects.get_or_create(user=user)

    #     if produit.stock == 0:
    #         raise ValidationError("Ce produit n'est plus disponible.")

    #     article, created = Article.objects.get_or_create(user=user, produit=produit, defaults={'quantite': quantite})
    #     if not created:
    #         if article.quantite + quantite > produit.stock:
    #             raise ValidationError(f"""La quantité disponible pour ce produit est : ({produit.stock}).
    #                                    Vous avez déjà ajouté {article.quantite} entité du produit dans votre panier.""")
    #         article.quantite += quantite
    #         article.save()
    #         message = "Article mis à jour dans le panier."
    #     else:
    #         if quantite > produit.stock:
    #             raise ValidationError(f'La quantité disponible pour ce produit est : ({produit.stock}).')
    #         article.quantite = quantite
    #         article.save()
    #         message = "Article ajouté dans le panier."

    #     panier.articles.add(article)
    #     panier.save()
    #     return Response({"message": message}, status=status.HTTP_201_CREATED)

    def put(self, request):
        user = verifier_user(request)
        panier, created = Panier.objects.get_or_create(user=user)
        q = request.data.get('quantite')
        id_article = request.data.get('id_article')

        article = Article.objects.filter(id=id_article).first()
        if not article:
            raise NotFound("Article non trouvé.")

        if q > article.produit.stock:
                raise ValidationError('La quantité disponible pour ce produit est : ({produit.stock}')
        article.quantite = q
        article.save()
        panier.save()
        serializer = CartSerializer(panier)
        return Response(serializer.data,status=status.HTTP_201_CREATED)


class ValidateCartView(APIView):
    def post(self, request):
        user = verifier_user(request)
        panier = Panier.objects.filter(user=user).first()

        if not panier:
            raise NotFound("Panier non trouvé.")

        if not panier.articles.exists():
            raise ValidationError("Le panier est vide.")

        for article in panier.articles.all():
            produit = article.produit
            if article.quantite > produit.stock:
                raise ValidationError(f"Le produit {produit.nom} n'a plus suffisamment de stock.")
            article.dateCommande = timezone.now()
            article.statutCommande = True
            article.save()

        return Response({"message": "Panier validé et commande créée."}, status=status.HTTP_201_CREATED)