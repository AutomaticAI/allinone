import React from "react";
import Helmet from "react-helmet";

interface ISchemaOrgProps {
  author: {
    name: string;
  };
  siteUrl: string;
  datePublished: string;
  defaultTitle: string;
  description: string;
  image: string;
  isBlogPost: boolean;
  organization: {
    name: string;
    url: string;
    logo: string;
  };
  title: string;
  url: string;
}

export default React.memo(
  ({
    author,
    siteUrl,
    datePublished,
    defaultTitle,
    description,
    image,
    isBlogPost,
    organization,
    title,
    url,
  }: ISchemaOrgProps) => {
    const baseSchema = [
      {
        "@context": "http://schema.org",
        "@type": "WebSite",
        url,
        name: title,
        alternateName: defaultTitle,
      },
    ];

    const schema = isBlogPost
      ? [
          ...baseSchema,
          {
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@id": url,
                  name: title,
                  image,
                },
              },
            ],
          },
          {
            "@context": "http://schema.org",
            "@type": "BlogPosting",
            url,
            name: title,
            alternateName: defaultTitle,
            headline: title,
            image: {
              "@type": "ImageObject",
              url: image,
            },
            description,
            author: {
              "@type": "Person",
              name: author.name,
            },
            publisher: {
              "@type": "Organization",
              url: organization.url,
              logo: organization.logo,
              name: organization.name,
            },
            mainEntityOfPage: {
              "@type": "WebSite",
              "@id": siteUrl,
            },
            datePublished,
          },
        ]
      : baseSchema;

    return (
      <Helmet>
        {/* Schema.org tags */}
        <script type='application/ld+json'>{JSON.stringify(schema)}</script>
      </Helmet>
    );
  }
);
